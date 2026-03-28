import React from "react";
import { Sun, Moon, Coffee } from "lucide-react";

export type ShiftType = "P" | "S" | "M" | "O";

export const SHIFT_LEGEND = [
  { code: "P", label: "Pagi", color: "bg-green-500", textColor: "text-white", softBg: "bg-green-100", icon: <Sun size={14} /> },
  { code: "S", label: "Siang", color: "bg-yellow-500", textColor: "text-white", softBg: "bg-yellow-100", icon: <Sun size={14} className="mt-2" /> },
  { code: "M", label: "Malam", color: "bg-blue-500", textColor: "text-white", softBg: "bg-blue-100", icon: <Moon size={14} /> },
  { code: "O", label: "Off", color: "bg-red-500", textColor: "text-white", softBg: "bg-red-100", icon: <Coffee size={14} /> },
];

export default function ShiftPalette() {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, code: string) => {
    e.dataTransfer.setData("shiftCode", code);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4 shadow-sm h-fit">
      <h3 className="text-sm font-semibold text-blue-dark mb-3 flex items-center gap-2">
        <span>Palet Shift</span>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium">Drag</span>
      </h3>
      <div className="flex flex-col gap-2">
        {SHIFT_LEGEND.map((shift) => (
          <div
            key={shift.code}
            draggable
            onDragStart={(e) => handleDragStart(e, shift.code)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-grab hover:scale-[1.02] active:cursor-grabbing transition-transform border border-transparent hover:border-border ${shift.softBg}`}
          >
            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${shift.color} ${shift.textColor} shadow-sm`}>
              {shift.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-dark leading-none">{shift.label}</p>
              <p className="text-xs text-muted-foreground mt-1">Kode: {shift.code}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
