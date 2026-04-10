"use client";

import { useState } from "react";
import { createConsole } from "@/app/actions/consoleActions";
import Link from "next/link";

export default function NewConsole() {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      {/* FONDO */}
      <div className="absolute inset-0 bg-[url('/imgs/bg_game.png')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* VOLVER */}
      <div className="mb-4">
        <Link
          href="/consolas"
          className="inline-block px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm"
        >
          ← Volver
        </Link>
      </div>

      {/* FORM */}
      <form
        action={createConsole}
        className="relative z-10 w-full max-w-2xl bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col gap-5"
      >
        {/* TITULO */}
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Crear Consola 🎮
        </h2>

        {/* INPUTS */}
        <div className="grid grid-cols-1 gap-4">
          
          <input
            name="name"
            placeholder="Nombre de la consola"
            required
            className="input"
          />

          <input
            name="manufacturer"
            placeholder="Fabricante"
            required
            className="input"
          />

          <input
            type="date"
            name="releasedate"
            required
            className="input"
          />

          <textarea
            name="description"
            placeholder="Descripción"
            className="input min-h-[100px]"
            required
          />

          {/* IMAGEN */}    
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">
              Imagen de la consola
            </label>

            <input
              type="file"
              name="image"
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

        {/* BOTON */}
        <button className="mt-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 transition">
          Crear Consola
        </button>
      </form>

      {/* ESTILOS */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          border-radius: 10px;
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid #4b5563;
          color: white;
        }
      `}</style>
    </div>
  );
}