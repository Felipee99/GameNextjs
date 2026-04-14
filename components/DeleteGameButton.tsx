"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { deleteGame } from "@/app/actions/gameActions";

export default function DeleteGameButton({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "¿Eliminar juego?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    const res = await deleteGame(id);

    if (res?.success) {
      await Swal.fire({
        title: "Eliminado",
        text: "El juego fue eliminado correctamente",
        icon: "success",
        confirmButtonColor: "#22c55e",
      });

      router.refresh(); 
    } else {
      Swal.fire("Error", "No se pudo eliminar", "error");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex-1 text-center text-xs bg-red-500/20 py-1 rounded-lg hover:bg-red-500/40 transition"
    >
      Eliminar
    </button>
  );
}
