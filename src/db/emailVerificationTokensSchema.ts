import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./usersSchema";

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, {
      onDelete: "cascade", // if the user gets deleted from our users table, then the associated record with the matching user ID in the password reset tokens table will also be deleted.
    })
    .unique(),
  token: text("token"),
  tokenExpiry: timestamp("token_expiry"),
});