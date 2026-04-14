"use client";

// Hooks de React
import { useState } from "react";

// Acción del backend (Server Action)
import { createGame } from "@/app/actions/gameActions";

// Link de Next.js para navegación sin recargar
import Link from "next/link";

// Librería para alertas bonitas
import Swal from "sweetalert2";

// Router de Next.js (para redirigir después de crear)
import { useRouter } from "next/navigation";

export default function NewGame({ consoles }: any) {
  // Estado para preview de la imagen seleccionada
  const [preview, setPreview] = useState<string | null>(null);

  const router = useRouter();

  // Maneja la selección de imagen
  const handleImage = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      // crea una URL temporal para mostrar la imagen sin subirla aún
      setPreview(URL.createObjectURL(file));
    }
  };

  // Maneja el submit del formulario (Server Action)
  const handleSubmit = async (formData: FormData) => {
    const res = await createGame(formData);

    // si todo sale bien
    if (res?.success) {
      await Swal.fire({
        title: "¡Creado!",
        text: "El juego se creó correctamente",
        icon: "success",
        confirmButtonColor: "#22c55e",
      });

      // redirige a la lista de juegos
      router.push("/games");
    } else {
      Swal.fire("Error", "No se pudo crear el juego", "error");
    }
  };

  return (
    // CONTENEDOR PRINCIPAL (pantalla completa + centrado)
    <div className="min-h-screen flex items-center justify-center relative p-6">

      {/* FONDO (imagen) */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>

      {/* OVERLAY (oscurece el fondo) */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* BOTÓN VOLVER (arriba izquierda fijo) */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/games"
          className="inline-block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm"
        >
          ← Volver
        </Link>
      </div>

      {/* FORMULARIO PRINCIPAL (centrado en pantalla) */}
      <form
        action={handleSubmit}
        className="relative z-10 w-full max-w-2xl bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col gap-5"
      >
        {/* TÍTULO */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Crear Juego
        </h2>

        {/* GRID DE INPUTS */}
        <div className="grid grid-cols-2 gap-4">

          {/* Título del juego */}
          <input
            name="title"
            placeholder="Título"
            required
            className="input"
          />

          {/* Desarrollador */}
          <input
            name="developer"
            placeholder="Desarrollador"
            required
            className="input"
          />

          {/* Fecha de lanzamiento */}
          <input
            type="date"
            name="releasedate"
            required
            className="input"
          />

          {/* Precio */}
          <input
            name="price"
            type="number"
            placeholder="Precio"
            required
            className="input"
          />

          {/* Género */}
          <input
            name="genre"
            placeholder="Género"
            required
            className="input"
          />

          {/* Consola */}
          <select
            name="console_id"
            required
            className="input"
          >
            <option value="">Selecciona consola</option>
            {consoles.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* IMAGEN + PREVIEW */}
          <div className="col-span-2 flex flex-col gap-2">

            {/* texto ayuda */}
            <label className="text-sm text-gray-300">
              Imagen del juego
            </label>

            {/* input file */}
            <input
              type="file"
              name="cover"
              accept="image/*"
              onChange={handleImage}
              className="input"
              required
            />

            {/* preview de imagen seleccionada */}
            {preview && (
              <img
                src={preview}
                className="mt-2 h-40 object-cover rounded-lg border border-gray-600"
              />
            )}
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <textarea
          name="description"
          placeholder="Descripción"
          className="input min-h-[100px]"
        />

        {/* BOTÓN SUBMIT */}
        <button className="mt-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition">
          Crear Juego
        </button>
      </form>
    </div>
  );
}