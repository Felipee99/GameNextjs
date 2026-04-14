"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { gameSchema } from "../schemas/gameSchema";

// conexión a la base de datos
const prisma = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
  }),
});


// CREAR JUEGO
export async function createGame(formData: FormData) {
  try {
    // obtener datos del formulario
    const rawData = {
      title: formData.get("title"),
      developer: formData.get("developer"),
      price: formData.get("price"),
      genre: formData.get("genre"),
      description: formData.get("description"),
      console_id: formData.get("console_id"),
      releasedate: formData.get("releasedate"),
    };

    // validar con Zod
    const result = gameSchema.safeParse(rawData);

    // si falla la validación, no continúa
    if (!result.success) {
      return { success: false };
    }

    const data = result.data;

    // obtener imagen
    const file = formData.get("cover");

    // validar que exista imagen
    if (!(file instanceof File) || file.size === 0) {
      return { success: false };
    }

    // crear nombre único para la imagen
    const fileName = `${Date.now()}-${file.name}`;

    // convertir archivo a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // guardar imagen en carpeta public/imgs
    fs.writeFileSync(
      path.join(process.cwd(), "public/imgs", fileName),
      buffer
    );

    // guardar en base de datos
    await prisma.game.create({
      data: {
        ...data,
        cover: fileName,
        description: data.description ?? "",
      },
    });

    // refrescar página de juegos
    revalidatePath("/games");

    return { success: true };

  } catch (error) {
    return { success: false };
  }
}


// ELIMINAR JUEGO
export async function deleteGame(id: number) {
  try {
    // buscar juego
    const game = await prisma.game.findUnique({
      where: { id },
    });

    // si no existe, cancelar
    if (!game) return { success: false };

    // eliminar imagen del servidor
    if (game.cover) {
      const filePath = path.join(process.cwd(), "public/imgs", game.cover);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // eliminar registro en la base de datos
    await prisma.game.delete({
      where: { id },
    });

    // refrescar lista
    revalidatePath("/games");

    return { success: true };

  } catch (error) {
    return { success: false };
  }
}


// EDITAR JUEGO
export async function updateGame(id: number, formData: FormData) {

  // obtener datos del formulario
  const rawData = {
    title: formData.get("title"),
    developer: formData.get("developer"),
    price: formData.get("price"),
    genre: formData.get("genre"),
    description: formData.get("description"),
    console_id: formData.get("console_id"),
    releasedate: formData.get("releasedate"),
  };

  // validar con Zod
  const result = gameSchema.safeParse(rawData);

  if (!result.success) {
    return { success: false };
  }

  const data = result.data;

  // traer juego actual desde la base de datos
  const existingGame = await prisma.game.findUnique({
    where: { id },
  });

  if (!existingGame) {
    return { success: false };
  }

  const file = formData.get("cover");
  let fileName: string | undefined;

  // si el usuario sube una nueva imagen
  if (file instanceof File && file.size > 0) {

    // eliminar imagen anterior
    if (existingGame.cover) {
      const oldPath = path.join(process.cwd(), "public/imgs", existingGame.cover);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // guardar nueva imagen
    const newFileName = `${Date.now()}-${file.name}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    fs.writeFileSync(
      path.join(process.cwd(), "public/imgs", newFileName),
      buffer
    );

    fileName = newFileName;
  }

  // actualizar datos en la base de datos
  await prisma.game.update({
    where: { id },
    data: {
      ...data,
      description: data.description ?? "",
      cover: fileName ?? existingGame.cover, // mantiene la imagen si no se cambia
    },
  });

  // refrescar lista
  revalidatePath("/games");

  return { success: true };
}