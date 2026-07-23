import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CATEGORIES,
  DISHES,
  DEFAULT_OPENING_HOURS,
} from "../src/lib/menu-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding China Restaurant Three Kingdoms...");

  // --- Super admin -----------------------------------------------------
  const email = process.env.ADMIN_EMAIL ?? "owner@three-kingdoms.de";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe!2024";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "Restaurant Owner" },
    create: {
      email,
      passwordHash,
      name: "Restaurant Owner",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin ready: ${email}`);

  // --- Categories ------------------------------------------------------
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {
        slug: cat.slug,
        nameDe: cat.nameDe,
        nameEn: cat.nameEn,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
      create: {
        id: cat.id,
        slug: cat.slug,
        nameDe: cat.nameDe,
        nameEn: cat.nameEn,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
    });
  }
  console.log(`✅ ${CATEGORIES.length} categories seeded`);

  // --- Dishes ----------------------------------------------------------
  for (const dish of DISHES) {
    await prisma.dish.upsert({
      where: { id: dish.id },
      update: {
        slug: dish.slug,
        nameDe: dish.nameDe,
        nameEn: dish.nameEn,
        nameZh: dish.nameZh,
        descriptionDe: dish.descriptionDe,
        descriptionEn: dish.descriptionEn,
        price: dish.price,
        imageUrl: dish.imageUrl,
        spiceLevel: dish.spiceLevel,
        isBestseller: dish.isBestseller,
        isVegetarian: dish.isVegetarian,
        isVegan: dish.isVegan,
        isAvailable: dish.isAvailable,
        allergens: dish.allergens,
        sortOrder: dish.sortOrder,
        categoryId: dish.categoryId,
      },
      create: {
        id: dish.id,
        slug: dish.slug,
        nameDe: dish.nameDe,
        nameEn: dish.nameEn,
        nameZh: dish.nameZh,
        descriptionDe: dish.descriptionDe,
        descriptionEn: dish.descriptionEn,
        price: dish.price,
        imageUrl: dish.imageUrl,
        spiceLevel: dish.spiceLevel,
        isBestseller: dish.isBestseller,
        isVegetarian: dish.isVegetarian,
        isVegan: dish.isVegan,
        isAvailable: dish.isAvailable,
        allergens: dish.allergens,
        sortOrder: dish.sortOrder,
        categoryId: dish.categoryId,
      },
    });
  }
  console.log(`✅ ${DISHES.length} dishes seeded`);

  // --- Settings --------------------------------------------------------
  await prisma.setting.upsert({
    where: { id: "singleton" },
    update: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      openingHours: DEFAULT_OPENING_HOURS as any,
    },
    create: {
      id: "singleton",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      openingHours: DEFAULT_OPENING_HOURS as any,
      specialDates: [],
      reservationsEnabled: true,
      takeawayEnabled: true,
      deliveryEnabled: true,
      deliveryFee: 3.5,
      minOrderValue: 15.0,
    },
  });
  console.log("✅ Settings seeded");

  // --- Demo orders & reservations (nice-to-have for dashboard) --------
  const existingOrders = await prisma.order.count();
  if (existingOrders === 0) {
    await prisma.order.createMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: [
        {
          customerName: "Anna Weber",
          phone: "0170 1234567",
          email: "anna@example.com",
          type: "TAKEAWAY",
          items: [
            { dishId: "dish-mapo-tofu", name: "Mapo Tofu", price: 14.9, quantity: 1 },
            { dishId: "dish-steamed-rice", name: "Duftreis", price: 3.5, quantity: 2 },
          ],
          subtotal: 21.9,
          deliveryFee: 0,
          total: 21.9,
          pickupTime: "19:30",
          status: "CONFIRMED",
        },
        {
          customerName: "Markus Klein",
          phone: "0171 9876543",
          email: "markus@example.com",
          type: "DELIVERY",
          address: "Königsallee 12, 40212 Düsseldorf",
          items: [
            { dishId: "dish-kung-pao", name: "Kung Pao Chicken", price: 15.9, quantity: 1 },
            { dishId: "dish-yangzhou-fried-rice", name: "Yangzhou Fried Rice", price: 11.9, quantity: 1 },
          ],
          subtotal: 27.8,
          deliveryFee: 3.5,
          total: 31.3,
          status: "PENDING",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    });
    console.log("✅ Demo orders seeded");
  }

  const existingReservations = await prisma.reservation.count();
  if (existingReservations === 0) {
    const today = new Date().toISOString().slice(0, 10);
    await prisma.reservation.createMany({
      data: [
        {
          name: "Familie Schmidt",
          phone: "0211 5551234",
          email: "schmidt@example.com",
          date: today,
          time: "20:00",
          guests: 4,
          notes: "Fensterplatz bevorzugt",
          status: "CONFIRMED",
        },
        {
          name: "Li Wei",
          phone: "0176 2223333",
          email: "liwei@example.com",
          date: today,
          time: "18:30",
          guests: 2,
          status: "PENDING",
        },
      ],
    });
    console.log("✅ Demo reservations seeded");
  }

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
