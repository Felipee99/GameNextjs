import { z } from "zod";

export const gameSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),

  developer: z.string().min(1, "El desarrollador es obligatorio"),

  price: z.coerce.number().min(0, "Precio inválido"),

  genre: z.string().min(1, "El género es obligatorio"),

  description: z.string().optional().default(""),

  console_id: z.coerce.number(),

  releasedate: z.coerce.date(),
});