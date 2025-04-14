"use server";

import db from "@/db/drizzle";
import { auth } from "../../../../auth";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { passwordResetTokens } from "@/db/passwordResetTokensSchema";
import { mailer } from "@/lib/email";

export const passwordReset = async (emailAddress: string) => {
  const session = await auth();
  // kullanıcının giriş yapmış olup olmadığını kontrol etmek istiyoruz.
  // Çünkü eğer kullanıcı zaten giriş yaptıysa, bu passwordReset sunucu işlemini çalıştırmamalı.
  // Yani eğer session.user.id değeri var ise "Zaten giriş yapmışsınız." şeklinde bu işlemi erken sonlandırmak istiyoruz
  if (!!session?.user?.id) {
    return {
      error: true,
      message: "You are already logged in",
    };
  }
  //   Eğer oturum yoksa yani giriş yapılmamışsa, devam edebiliriz.
  const [user] = await db
    .select({
      id: users.id,
    })
    .from(users)
    .where(eq(users.email, emailAddress));
  // If there was no user in our database that matches this email address, so we're not going to return any error, we're just simply going to return.
  // So we're going to quit running the password reset server action.
  if (!user) {
    return;
  }
  // However, if there is a user in our database with this email address, it's at this point we want to create a password reset token.
  const passwordResetToken = randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 3600000);
  console.log(tokenExpiry);

  await db
    .insert(passwordResetTokens)
    .values({
      userId: user.id,
      token: passwordResetToken,
      tokenExpiry,
    })
    .onConflictDoUpdate({
      target: passwordResetTokens.userId,
      set: {
        token: passwordResetToken,
        tokenExpiry,
      },
    });

  const resetLink = `${process.env.SITE_BASE_URL}/update-password?token=${passwordResetToken}`;

  await mailer.sendMail({
    from: "test@resend.dev",
    subject: "Your password reset request",
    to: emailAddress,
    html: `Hey, ${emailAddress}! You requested to reset your password.
    Here's your password reset link. This link will expire in 1 hour:
    <a href="${resetLink}">${resetLink}</a>`,
  });

  console.log({ passwordResetToken });
};
