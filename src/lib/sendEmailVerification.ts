import db from "@/db/drizzle";
import { emailVerificationTokens } from "@/db/emailVerificationTokensSchema";
import { randomBytes } from "crypto";
import { mailer } from "@/lib/email";
import { eq } from "drizzle-orm";

export async function sendEmailVerification(userId: number, email: string) {
    // Eski tokenı sil
    await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.userId, userId));

    const verificationToken = randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600_000);

    await db.insert(emailVerificationTokens).values({
        userId,
        token: verificationToken,
        tokenExpiry,
    });

    const verificationLink = `${process.env.SITE_BASE_URL}/verify-email?token=${verificationToken}`;

    await mailer.sendMail({
        from: "test@resend.dev",
        subject: "Verify your email address",
        to: email,
        html: `Welcome! Please verify your email by clicking the link below:<br/>
             <a href="${verificationLink}">${verificationLink}</a><br/>
             This link will expire in 1 hour.`,
    });
}