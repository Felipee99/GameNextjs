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

// CREAR CONSOLA
export async function createConsole(formData: FormData) {
  // Se obtiene el archivo enviado desde el formulario
  const file = formData.get("image") as File;

  // Validación básica: si no hay imagen, se detiene el proceso
  if (!file || file.size === 0) {
    throw new Error("Imagen requerida");
  }

  // Se genera un nombre único para evitar conflictos
  const fileName = `${Date.now()}-${file.name}`;

  // Se convierte el archivo a buffer para poder guardarlo
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ruta donde se guardará la imagen en el proyecto
  const filePath = path.join(
    process.cwd(),
    "public/imgs",
    fileName
  );

  // Se escribe el archivo en el sistema
  fs.writeFileSync(filePath, buffer);

  // Se guarda la consola en la base de datos
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

  // Se refresca la lista y se redirige
  revalidatePath("/consoles");
  redirect("/consoles");
}

// ELIMINAR CONSOLA
export async function deleteConsole(id: number) {
  // Se elimina directamente de la base de datos
  // Nota: aquí no se está eliminando la imagen del servidor
  await prisma.console.delete({
    where: { id },
  });

  revalidatePath("/consoles");
}

// EDITAR CONSOLA
export async function updateConsole(id: number, formData: FormData) {
  const file = formData.get("image") as File;

  // Esta variable solo tendrá valor si el usuario sube una nueva imagen
  let fileName: string | undefined = undefined;

  // Si se sube una nueva imagen
  if (file && file.size > 0) {
    const newFileName = `${Date.now()}-${file.name}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(
      process.cwd(),
      "public/imgs",
      newFileName
    );

    // Se guarda la nueva imagen
    fs.writeFileSync(filePath, buffer);

    fileName = newFileName;
  }

  // Se obtiene la consola actual para saber qué imagen tenía antes
  const existingConsole = await prisma.console.findUnique({
    where: { id },
  });

  // Se actualiza la consola
  await prisma.console.update({
    where: { id },
    data: {
      name: formData.get("name") as string,

      // Si hay nueva imagen, se usa esa
      // Si no, se mantiene la imagen anterior
      image: fileName ?? existingConsole?.image,
    },
  });

  revalidatePath("/consoles");
}