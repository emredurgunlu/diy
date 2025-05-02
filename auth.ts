import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    // buradaki call back const session = await auth(); kısmındaki session bilgilerine id eklemek için bkz. logged-out layout.tsx
    callbacks: {
        async jwt({ token, user, account, profile }) {
          // Google ile giriş yapıldıysa
          if (account?.provider === "google") {
            // Google'dan gelen email
            const email = profile?.email as string;
            // Veritabanında kullanıcıyı ara
            let [dbUser] = await db.select().from(users).where(eq(users.email, email));
            // Eğer kullanıcı yoksa, ekle
            if (!dbUser) {
              const newUser = await db
                .insert(users)
                .values({
                  email,
                  name: profile?.name as string,
                  image: profile?.picture as string,
                  googleId: profile?.sub as string,
                  isUserVerified: true, // Google ile girişte verified sayabilirsin
                  // Diğer alanlar default kalabilir
                })
                .returning();
              dbUser = newUser[0];
            }
            // Token'a user id ekle
            token.id = dbUser.id;
          }
          // Credentials ile girişte mevcut kodun çalışmaya devam etsin
          if (user) {
            token.id = user.id;
          }
          return token;
        },
        session({ session, token }) {
          session.user.id = token.id as string;
          return session;
        },
      },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
          }),
        Credentials({
            credentials: {
                email: {},
                password: {},
                token: {},
            },
            async authorize(credentials) {
                // const results  const user = result[0] bunların gibi yapmak yerine bunu yapmak const [user] daha kısa bir yöntem
                const [user] = await db.select().from(users).where(eq(users.email, credentials.email as string));
                if (!user) {
                    throw new Error("Incorrect credentials");
                } else {
                    const passwordCorrect = await compare(
                        credentials.password as string,
                        user.password!
                    );
                    if (!passwordCorrect) {
                        throw new Error("Incorrect credentials");
                    }
                }
                return {
                    id: user.id.toString(),
                    email: user.email,
                };
            },
        },
        ),
    ],
},
)