import { z } from "zod";

export const reservationSchema = z.object({
  name: z.string().min(2, "Bitte geben Sie Ihren Namen an").max(80),
  phone: z
    .string()
    .min(6, "Bitte geben Sie eine gültige Telefonnummer an")
    .max(30),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse an"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Bitte wählen Sie ein Datum"),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Bitte wählen Sie eine Uhrzeit"),
  guests: z
    .coerce.number()
    .int()
    .min(1, "Mindestens 1 Gast")
    .max(20, "Für Gruppen über 20 Personen rufen Sie uns bitte an"),
  notes: z.string().max(500).optional().default(""),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const cartItemSchema = z.object({
  dishId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1).max(50),
});

export const orderSchema = z.object({
  customerName: z.string().min(2, "Bitte geben Sie Ihren Namen an").max(80),
  phone: z.string().min(6, "Bitte geben Sie eine Telefonnummer an").max(30),
  email: z.string().email("Ungültige E-Mail").or(z.literal("")).optional().default(""),
  type: z.enum(["TAKEAWAY", "DELIVERY"]),
  address: z.string().max(200).optional().default(""),
  pickupTime: z.string().max(20).optional().default(""),
  notes: z.string().max(500).optional().default(""),
  items: z.array(cartItemSchema).min(1, "Ihr Warenkorb ist leer"),
}).refine(
  (data) => data.type !== "DELIVERY" || (data.address && data.address.length > 4),
  { message: "Bitte geben Sie eine Lieferadresse an", path: ["address"] },
);

export type OrderInput = z.infer<typeof orderSchema>;

export const loginSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
  password: z.string().min(1, "Bitte Passwort eingeben"),
});

export const dishSchema = z.object({
  nameDe: z.string().min(2),
  nameEn: z.string().min(2),
  nameZh: z.string().optional().default(""),
  descriptionDe: z.string().optional().default(""),
  descriptionEn: z.string().optional().default(""),
  price: z.coerce.number().min(0),
  imageUrl: z.string().optional().default(""),
  spiceLevel: z.coerce.number().int().min(0).max(3).default(0),
  isBestseller: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
  isVegan: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  allergens: z.array(z.string()).default([]),
  sortOrder: z.coerce.number().int().default(0),
  categoryId: z.string().min(1),
});

export type DishInput = z.infer<typeof dishSchema>;
