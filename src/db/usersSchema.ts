import { boolean, decimal, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  password: text("password"),
  name: text("name"), // Google'dan gelen isim
  image: text("image"), // Google profil fotoğrafı
  googleId: text("google_id"), // Google'ın benzersiz user id'si (sub)
  isUserVerified: boolean("is_user_verified").default(false), // Kullanıcının doğrulama durumu (email verification)
  creditsRemaining: integer("credits_remaining").default(0), // Kullanıcının şu anki kredi miktarı
  totalCreditsPurchased: integer("total_credits_purchased").default(0), // Kullanıcının toplam satın aldığı kredi miktarı
  pricePaid: decimal("price_paid"), // Ödenen miktar (örneğin $100)
  lastLogin: timestamp("last_login"), // Kullanıcının en son giriş yaptığı tarih
  createdAt: timestamp("created_at").defaultNow(),
});