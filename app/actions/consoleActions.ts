"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});

// CREAR
export async function createConsole(formData: FormData) {
  const file = formData.get("image") as File;

  if (!file || file.size === 0) {
    throw new Error("Imagen requerida");
  }

  const fileName = `${Date.now()}-${file.name}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = path.join(
    process.cwd(),
    "public/imgs",
    fileName
  );

  fs.writeFileSync(filePath, buffer);

  await prisma.console.create({
  data: {
    name: formData.get("name") as string,
    image: fileName,
    manufacturer: formData.get("manufacturer") as string,
    description: formData.get("description") as string,
    releasedate: new Date(
      formData.get("releasedate") as string
    ),
  },
});

  revalidatePath("/consoles");
  redirect("/consoles");
}

// ELIMINAR
export async function deleteConsole(id: number) {
  await prisma.console.delete({
    where: { id },
  });

  revalidatePath("/consoles");
}

// EDITAR
export async function updateConsole(id: number, formData: FormData) {
  const file = formData.get("image") as File;

  let fileName: string | undefined = undefined;

  // SI SUBEN NUEVA IMAGEN
  if (file && file.size > 0) {
    const newFileName = `${Date.now()}-${file.name}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(
      process.cwd(),
      "public/imgs",
      newFileName
    );

    fs.writeFileSync(filePath, buffer);

    fileName = newFileName;
  }

  // OBTENER CONSOLA ACTUAL
  const existingConsole = await prisma.console.findUnique({
    where: { id },
  });

  await prisma.console.update({
    where: { id },
    data: {
      name: formData.get("name") as string,

      // 🔥 CLAVE
      image: fileName ?? existingConsole?.image,
    },
  });

  revalidatePath("/consoles");
}