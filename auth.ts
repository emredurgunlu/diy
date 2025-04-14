import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    // buradaki call back const session = await auth(); kısmındaki session bilgilerine id eklemek için bkz. logged-out layout.tsx
    callbacks: {
        jwt({ token, user }) {
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