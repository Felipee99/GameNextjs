"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { updateGame } from "@/app/actions/gameActions";

export default function EditGameForm({ game, consoles }: any) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    const res = await updateGame(game.id, formData);

    if (res?.success) {
      await Swal.fire({
        title: "¡Actualizado!",
        text: "El juego se editó correctamente",
        icon: "success",
        confirmButtonColor: "#22c55e",
      });

      router.push("/games");
    } else {
      Swal.fire("Error", "No se pudo actualizar", "error");
    }
  };

  const formattedDate = new Date(game.releasedate)
    .toISOString()
    .split("T")[0];

  return (
    <form
      action={handleSubmit}
      className="relative z-10 w-full max-w-2xl bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col gap-5 text-white"
    >
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        Editar Juego
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-2 gap-4">
        <input
          name="title"
          defaultValue={game.title}
          placeholder="Título"
          className="input"
        />

        <input
          name="developer"
          defaultValue={game.developer}
          placeholder="Desarrollador"
          className="input"
        />

        <input
          type="date"
          name="releasedate"
          defaultValue={formattedDate}
          className="input"
        />

        <input
          name="price"
          type="number"
          defaultValue={game.price}
          placeholder="Precio"
          className="input"
        />

        <input
          name="genre"
          defaultValue={game.genre}
          placeholder="Género"
          className="input"
        />

        <select
          name="console_id"
          defaultValue={game.console_id}
          className="input"
        >
          {consoles.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* IMAGEN */}
        <div className="col-span-2 flex flex-col gap-2">
          <label className="text-sm text-gray-300">Imagen actual</label>

          <img
            src={`/imgs/${game.cover}`}
            className="h-40 object-cover rounded-lg border border-gray-600"
          />

          <label className="text-sm text-gray-400 mt-2">
            Cambiar imagen (opcional)
          </label>

          <input
            type="file"
            name="cover"
            accept="image/*"
            className="input"
          />
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <textarea
        name="description"
        defaultValue={game.description}
        placeholder="Descripción"
        className="input min-h-[100px]"
      />

      {/* BOTONES */}
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 transition font-semibold tracking-wide hover:scale-105 active:scale-95"
        >
          Guardar cambios
        </button>

        <button
          type="button"
          onClick={() => router.push("/games")}
          className="flex-1 py-3 rounded-xl bg-gray-500/20 hover:bg-gray-500/40 transition"
        >
          Cancelar
        </button>
      </div>

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
    </form>
  );
}