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

export async function createGame(formData: FormData) {
    const file = formData.get("cover") as File;

    if (!file || file.size === 0) {
        throw new Error("Imagen requerida");
    }

    const fileName = `${Date.now()}-${file.name}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(process.cwd(), "public/imgs", fileName);

    fs.writeFileSync(filePath, buffer);

    await prisma.game.create({
        data: {
            title: formData.get("title") as string,
            developer: formData.get("developer") as string,
            price: Number(formData.get("price")),
            genre: formData.get("genre") as string,
            description: formData.get("description") as string,
            cover: fileName,
            console_id: Number(formData.get("console_id")),
            releasedate: new Date(formData.get("releasedate") as string),
        },
    });

    revalidatePath("/games");

    redirect("/games");
}

// ELIMINAR
export async function deleteGame(id: number) {
    await prisma.game.delete({
        where: { id },
    });

    revalidatePath("/games");
}

// EDITAR
export async function updateGame(id: number, formData: FormData) {
    const file = formData.get("cover") as File;

    let fileName: string | undefined = undefined;

    // SI SUBEN NUEVA IMAGEN
    if (file && file.size > 0) {
        const newFileName = `${Date.now()}-${file.name}`;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filePath = path.join(process.cwd(), "public/imgs", newFileName);

        fs.writeFileSync(filePath, buffer);

        fileName = newFileName;
    }

    // OBTENER IMAGEN ACTUAL SI NO SUBEN NADA
    const existingGame = await prisma.game.findUnique({
        where: { id },
    });

    await prisma.game.update({
        where: { id },
        data: {
            title: formData.get("title") as string,
            developer: formData.get("developer") as string,
            price: Number(formData.get("price")),
            genre: formData.get("genre") as string,
            description: formData.get("description") as string,
            console_id: Number(formData.get("console_id")),
            releasedate: new Date(formData.get("releasedate") as string),

            //  CLAVE
            cover: fileName ?? existingGame?.cover,
        },
    });

    revalidatePath("/games");
}