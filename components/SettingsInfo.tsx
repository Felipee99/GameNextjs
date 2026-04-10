"use client";

import { useState } from "react";
import { AccountSettings } from "@stackframe/stack";

export default function SettingsInfo() {
  const [section, setSection] = useState("profile");

  return (
    <div className="p-6 text-white w-full">
      
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex gap-6">
        
        {/* 🔹 MENÚ (SOLO VISUAL) */}
        <div className="w-64 bg-white/5 p-4 rounded-xl">
          <ul className="space-y-2 text-sm">
            
            {[
             
            ].map((item) => (
              <li
                key={item}
                onClick={() => setSection(item)}
                className={`cursor-pointer p-2 rounded-lg capitalize ${
                  section === item
                    ? "bg-purple-600 text-purple-200"
                    : "hover:bg-white/10"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 🔹 CONTENIDO REAL */}
        <div className="flex-1 bg-white/5 p-6 rounded-xl">
          
          {/* 🔥 AQUÍ VA TODO STACK */}
          <AccountSettings />

        </div>
      </div>
    </div>
  );
}