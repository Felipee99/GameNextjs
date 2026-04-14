"use client";

import { useState } from "react";
import { createGame } from "@/app/actions/gameActions";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function NewGame({ consoles }: any) {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const res = await createGame(formData);

    if (res?.success) {
      await Swal.fire({
        title: "¡Creado!",
        text: "El juego se creó correctamente",
        icon: "success",
        confirmButtonColor: "#22c55e",
      });

      router.push("/games"); // 🔥 redirige después de alerta
    } else {
      Swal.fire("Error", "No se pudo crear el juego", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/games"
          className="inline-block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm"
        >
          ← Volver
        </Link>
      </div>

      <form
        action={handleSubmit}
        className="relative z-10 w-full max-w-2xl bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col gap-5"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Crear Juego
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input name="title" placeholder="Título" required className="input" />

          <input name="developer" placeholder="Desarrollador" required className="input" />

          <input type="date" name="releasedate" required className="input" />

          <input name="price" type="number" placeholder="Precio" required className="input" />

          <input name="genre" placeholder="Género" required className="input" />

          <select name="console_id" required className="input">
            <option value="">Selecciona consola</option>
            {consoles.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <div className="col-span-2 flex flex-col gap-2">
            <label className="text-sm text-gray-300">Imagen del juego</label>

            <input
              type="file"
              name="cover"
              accept="image/*"
              onChange={handleImage}
              className="input"
              required
            />

            {preview && (
              <img
                src={preview}
                className="mt-2 h-40 object-cover rounded-lg border border-gray-600"
              />
            )}
          </div>
        </div>

        <textarea
          name="description"
          placeholder="Descripción"
          className="input min-h-[100px]"
        />

        <button className="mt-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition">
          Crear Juego
        </button>
      </form>
    </div>
  );
}