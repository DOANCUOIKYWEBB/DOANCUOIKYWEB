"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ColorPickerFilterProps = {
  colors: string[];
  selectedColor: string | "all";
  onChange: (color: string | "all") => void;
};

export default function ColorPickerFilter({ colors, selectedColor, onChange }: ColorPickerFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-w-[150px]" ref={containerRef}>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-border/50 bg-surface/70 px-4 text-left text-sm font-semibold outline-none transition-all hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedColor === "all" ? (
            <span className="text-muted-foreground">Tất cả màu sắc</span>
          ) : (
            <>
              <span 
                className="h-4 w-4 rounded-full border border-black/10 shadow-sm" 
                style={{ backgroundColor: selectedColor }}
              />
              <span className="uppercase text-xs">{selectedColor}</span>
            </>
          )}
        </div>
        {selectedColor !== "all" ? (
          <X 
            className="h-4 w-4 shrink-0 text-muted hover:text-foreground cursor-pointer" 
            onClick={(e) => { e.stopPropagation(); onChange("all"); setIsOpen(false); }} 
          />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 sm:left-0 top-[calc(100%+0.5rem)] z-30 w-64 rounded-xl border border-border bg-surface p-3 shadow-2xl origin-top"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-muted">Bảng màu</span>
              {selectedColor !== "all" && (
                <button 
                  onClick={() => { onChange("all"); setIsOpen(false); }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Xóa lọc
                </button>
              )}
            </div>
            
            {colors.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted">Chưa có màu nào</p>
            ) : (
              <div className="grid grid-cols-7 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    title={color.toUpperCase()}
                    onClick={() => { onChange(color); setIsOpen(false); }}
                    className={`aspect-square w-full rounded-md border shadow-sm transition-transform hover:scale-110 ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : 'border-black/10'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
