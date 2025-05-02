"use server";

import db from "@/db/drizzle";
import { emailVerificationTokens } from "@/db/emailVerificationTokensSchema";
import { users } from "@/db/usersSchema";
import { eq } from "drizzle-orm";

export const verifyEmail = async (token: string) => {
  if (!token) {
    return { success: false, message: "Token not found." };
  }

  // Find the token
  const [verificationToken] = await db
    .select()
    .from(emailVerificationTokens)
    .where(eq(emailVerificationTokens.token, token));

  if (!verificationToken) {
    return { success: false, message: "Token is invalid or has expired." };
  }

  const now = Date.now();
  if (
    !verificationToken.tokenExpiry ||
    now > verificationToken.tokenExpiry.getTime()
  ) {
    return { success: false, message: "Token has expired." };
  }

  if (!verificationToken.userId) {
    return { success: false, message: "User not found." };
  }

  // Verify the user
  await db
    .update(users)
    .set({ isUserVerified: true })
    .where(eq(users.id, verificationToken.userId));

  // Delete the token (one-time use)
  await db
    .delete(emailVerificationTokens)
    .where(eq(emailVerificationTokens.id, verificationToken.id));

  return { success: true, message: "Your email address has been verified!" };
};
