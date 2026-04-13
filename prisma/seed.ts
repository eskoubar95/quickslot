import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();

  const base = new Date();
  base.setHours(9, 0, 0, 0);
  base.setMinutes(0, 0, 0);

  for (let i = 0; i < 6; i++) {
    const start = new Date(base);
    start.setDate(start.getDate() + Math.floor(i / 3));
    start.setHours(9 + (i % 3) * 2, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);

    await prisma.slot.create({
      data: {
        start,
        end,
        durationMinutes: 30,
      },
    });
  }

  console.log("Seeded slots:", await prisma.slot.count());
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
