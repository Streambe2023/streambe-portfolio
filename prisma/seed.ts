import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Definí ADMIN_EMAIL y ADMIN_PASSWORD en tu archivo .env antes de correr el seed."
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail.endsWith("@streambe.com")) {
    throw new Error("ADMIN_EMAIL debe ser un correo del dominio @streambe.com");
  }

  const passwordHash = hashPassword(password);

  await prisma.adminUser.upsert({
    where: { email: normalizedEmail },
    update: { passwordHash },
    create: { email: normalizedEmail, passwordHash },
  });

  console.log(`✔ Usuario admin listo: ${normalizedEmail}`);

  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    await prisma.project.createMany({
      data: [
        {
          name: "Proyecto de ejemplo 1",
          description:
            "Este es un proyecto de ejemplo. Reemplazalo por uno real desde el panel de administración.",
          imageUrl: "https://placehold.co/800x600/0253E8/FFFFFF?text=Streambe",
          projectUrl: "https://streambe.com",
          order: 1,
        },
        {
          name: "Proyecto de ejemplo 2",
          description:
            "Cargá acá el nombre, la imagen, la descripción y la URL real de cada proyecto.",
          imageUrl: "https://placehold.co/800x600/10192B/FFFFFF?text=Streambe",
          projectUrl: "https://streambe.com",
          order: 2,
        },
      ],
    });
    console.log("✔ Proyectos de ejemplo cargados");
  } else {
    console.log("→ Ya existían proyectos, no se agregaron ejemplos");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
