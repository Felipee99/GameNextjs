"use server";

import { PrismaClient } from "@/app/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { gameSchema } from "../schemas/gameSchema";

const prisma = new PrismaClient({
    adapter: new PrismaNeon({
        connectionString: process.env.DATABASE_URL!,
    }),
});


// gameActions.ts

export async function createGame(formData: FormData) {
    try {
        const rawData = {
            title: formData.get("title"),
            developer: formData.get("developer"),
            price: formData.get("price"),
            genre: formData.get("genre"),
            description: formData.get("description"),
            console_id: formData.get("console_id"),
            releasedate: formData.get("releasedate"),
        };

        const result = gameSchema.safeParse(rawData);

        if (!result.success) {
            return { success: false };
        }

        const data = result.data;

        const file = formData.get("cover");

        if (!(file instanceof File) || file.size === 0) {
            return { success: false };
        }

        const fileName = `${Date.now()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        fs.writeFileSync(
            path.join(process.cwd(), "public/imgs", fileName),
            buffer
        );

        await prisma.game.create({
            data: {
                ...data,
                cover: fileName,
                description: data.description ?? "",
            },
        });

        revalidatePath("/games");

        return { success: true };
    } catch (error) {
        return { success: false };
    }
}


//  ELIMINAR (CON RESPUESTA)
// gameActions.ts

export async function deleteGame(id: number) {
    try {
        const game = await prisma.game.findUnique({
            where: { id },
        });

        if (!game) return { success: false };

        // 🔥 eliminar imagen
        if (game.cover) {
            const filePath = path.join(process.cwd(), "public/imgs", game.cover);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // 🔥 eliminar en BD
        await prisma.game.delete({
            where: { id },
        });

        revalidatePath("/games");

        return { success: true };
    } catch (error) {
        return { success: false };
    }
}


// ✅ EDITAR (para SweetAlert)
export async function updateGame(id: number, formData: FormData) {
    const rawData = {
        title: formData.get("title"),
        developer: formData.get("developer"),
        price: formData.get("price"),
        genre: formData.get("genre"),
        description: formData.get("description"),
        console_id: formData.get("console_id"),
        releasedate: formData.get("releasedate"),
    };

    const result = gameSchema.safeParse(rawData);

    if (!result.success) {
        return { success: false };
    }

    const data = result.data;

    const file = formData.get("cover");
    let fileName: string | undefined;

    if (file instanceof File && file.size > 0) {
        const newFileName = `${Date.now()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());

        fs.writeFileSync(
            path.join(process.cwd(), "public/imgs", newFileName),
            buffer
        );

        fileName = newFileName;
    }

    const existingGame = await prisma.game.findUnique({
        where: { id },
    });

    await prisma.game.update({
        where: { id },
        data: {
            ...data,
            description: data.description ?? "", // 🔥 FIX
            cover: fileName ?? existingGame?.cover,
        },
    });

    revalidatePath("/games");

    return { success: true };
}