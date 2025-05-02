"use server";

import { passwordSchema } from "@/validation/passwordSchema";
import { z } from "zod";
import { signIn } from "../../../../auth";
import db from "@/db/drizzle";
import { users } from "@/db/usersSchema";
import { sendEmailVerification } from "@/lib/sendEmailVerification";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";
import { emailVerificationTokens } from "@/db/emailVerificationTokensSchema";

export const loginWithCredentials = async ({
    email,
    password,
    // token,
  }: {
    email: string;
    password: string;
    // token?: string;
  }) => {
    const loginSchema = z.object({
        email: z.string().email(),
        password: passwordSchema,
      });

      const loginValidation = loginSchema.safeParse({
        email,
        password,
      });

      if (!loginValidation.success) {
        return {
          error: true,
          message:
            loginValidation.error?.issues[0]?.message ?? "An error occurred.",
        };
      }

      // Kullanıcıyı bul
      const [user] = await db.select().from(users).where(eq(users.email, email));
      if (!user) {
        return {
          error: true,
          message: "Incorrect email or password.",
        };
      }

      // Doğrulama kontrolü
      if (!user.isUserVerified) {
        return {
          error: true,
          message: "Please verify your account before logging in.",
        };
      }

      // Şifre kontrolü
      const passwordCorrect = await compare(password, user.password!);
      if (!passwordCorrect) {
        return {
          error: true,
          message: "Incorrect email or password.",
        };
      }

      // Giriş işlemi
      try {
        await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
      } catch (e) {
        return {
          error: true,
          message: "Incorrect email or password.",
        };
      }
  }

export const resendVerificationEmail = async (email: string) => {
  if (!email) {
    return { error: true, message: "Email is required." };
  }
  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    return { error: true, message: "User not found." };
  }
  if (user.isUserVerified) {
    return { error: true, message: "User is already verified." };
  }
  await sendEmailVerification(user.id, user.email as string);
  return { success: true, message: "Verification email sent." };
};