"use server";

import { passwordSchema } from "@/validation/passwordSchema";
import { z } from "zod";
import { signIn } from "../../../../auth";

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
      try {
        await signIn("credentials",{
          email,
          password,
          redirect: false,
          // In here we want to set redirect equal to false.
          // So we're going to manually redirect the user after a successful sign in.
          // Now the reason for this is because if we have redirect set to true here redirects actually throw an
          // error.
          // And if we throw an error from a server action, it will seem like the server action actually failed.
          // So we need to set in here redirect equal to false.
        })
      } catch (e) {
        return {
          error: true,
          message: "Incorrect email or password.",
        };
      }
  }