"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");

  // sincroniza con URL
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  // debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      const newUrl = `/games?${params.toString()}`;
      const currentUrl = `/games?${searchParams.toString()}`;

      // 🔥 EVITA LOOP
      if (newUrl !== currentUrl) {
        router.replace(newUrl);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="mb-6 flex justify-center">
      <div className="relative w-full max-w-xl">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar juegos..."
          className="w-full px-5 py-3 rounded-xl bg-gray-900/70 backdrop-blur-md 
          border border-gray-600 text-white placeholder-gray-400
          focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40
          transition"
        />
      </div>
    </div>
  );
}
