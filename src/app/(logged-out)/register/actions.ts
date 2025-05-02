'use server';

import db from "@/db/drizzle";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { z } from "zod";
import {hash} from "bcryptjs";
import { users } from "@/db/usersSchema";
import { sendEmailVerification } from "@/lib/sendEmailVerification";

export const registerUser = async ({
    email,
    password,
    passwordConfirm,
  }: {
    email: string;
    password: string;
    passwordConfirm: string;
  }) => {

    try{
    const newUserSchema = z
    .object({
      email: z.string().email(),
    })
    .and(passwordMatchSchema);

    const newUserValidation = newUserSchema.safeParse({
        email,
        password,
        passwordConfirm,
      });

      if (!newUserValidation.success) {
        return {
          error: true,
          message:
            newUserValidation.error.issues[0]?.message ?? "An error occurred",
        };
      }

      const hashedPassword = await hash(password, 2);

      // await db.insert(users).values({
      //   email,
      //   password: hashedPassword,
      // });

      // Kullanıcıyı ekle ve id'sini al. Doğrulama maili göndermeseydik yukardaki await db.insert kod bloğunu kullanırdık
      const [newUser] = await db.insert(users).values({
          email,
          password: hashedPassword,
      }).returning();

      // Doğrulama maili gönder
      await sendEmailVerification(newUser.id, email);

    } catch (e: any) {
        if (e.code === "23505") {
          return {
            error: true,
            message: "An account is already registered with that email address.",
          };
        }
    
        return {
          error: true,
          message: "An error occurred.",
        };
      }
  };