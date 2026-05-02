import { PrismaClient, CategoryType } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  // Expense categories
  {
    name: "Makanan & Minuman",
    icon: "\u{1F35C}",
    color: "#FF6B6B",
    type: CategoryType.EXPENSE,
    isDefault: true,
    sortOrder: 1,
  },
  {
    name: "Transportasi",
    icon: "\u{1F697}",
    color: "#4ECDC4",
    type: CategoryType.EXPENSE,
    isDefault: true,
    sortOrder: 2,
  },
  {
    name: "Belanja",
    icon: "\u{1F6CD}\uFE0F",
    color: "#45B7D1",
    type: CategoryType.EXPENSE,
    isDefault: true,
    sortOrder: 3,
  },
  {
    name: "Tagihan",
    icon: "\u{1F4F1}",
    color: "#96CEB4",
    type: CategoryType.EXPENSE,
    isDefault: true,
    sortOrder: 4,
  },
  {
    name: "Hiburan",
    icon: "\u{1F3AE}",
    color: "#FFEAA7",
    type: CategoryType.EXPENSE,
    isDefault: true,
    sortOrder: 5,
  },
  // Income categories
  {
    name: "Gaji",
    icon: "\u{1F4BC}",
    color: "#6BCB77",
    type: CategoryType.INCOME,
    isDefault: true,
    sortOrder: 1,
  },
  {
    name: "Freelance",
    icon: "\u{1F4BB}",
    color: "#4D96FF",
    type: CategoryType.INCOME,
    isDefault: true,
    sortOrder: 2,
  },
] as const;

async function main(): Promise<void> {
  console.log("Seeding default categories...");

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: {
        // Use a composite lookup: find existing default category by name + type
        // Since there's no unique constraint on name alone, we use findFirst + create/update
        id:
          (
            await prisma.category.findFirst({
              where: {
                name: category.name,
                type: category.type,
                isDefault: true,
                userId: null,
              },
              select: { id: true },
            })
          )?.id ?? "nonexistent-id",
      },
      update: {
        icon: category.icon,
        color: category.color,
        sortOrder: category.sortOrder,
      },
      create: {
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
        isDefault: category.isDefault,
        sortOrder: category.sortOrder,
        userId: null,
      },
    });
  }

  const count = await prisma.category.count({ where: { isDefault: true } });
  console.log(`Seeded ${String(count)} default categories.`);
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
