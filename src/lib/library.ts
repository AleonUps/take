import { useEffect, useState, useCallback } from "react";
import type { SparkResult } from "@/lib/spark.functions";
import type { RawiResult } from "@/lib/rawi.functions";

export type SparkEntry = {
  id: string;
  kind: "spark";
  savedAt: number;
  thumbnail: string; // data URL
  grade: "elementary" | "middle" | "high";
  language: string;
  result: SparkResult;
};

export type RawiEntry = {
  id: string;
  kind: "rawi";
  savedAt: number;
  concept: string;
  countryCode: string;
  countryFlag: string;
  countryName: string;
  grade: "elementary" | "middle" | "high";
  language: string;
  languageName: string;
  result: RawiResult;
};

export type LibraryEntry = SparkEntry | RawiEntry;

const KEY = "educis_library";
const EVT = "educis-library-update";

function read(): LibraryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(items: LibraryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new Event(EVT));
  } catch (e) {
    console.error("Library save failed", e);
  }
}

export function saveToLibrary(
  entry:
    | Omit<SparkEntry, "id" | "savedAt">
    | Omit<RawiEntry, "id" | "savedAt">,
): string {
  const id = `${entry.kind}_${crypto.randomUUID()}`;
  const full = { ...entry, id, savedAt: Date.now() } as LibraryEntry;
  const existing = read();
  write([full, ...existing]);
  return id;
}

export function deleteFromLibrary(id: string) {
  write(read().filter((e) => e.id !== id));
}

export function getEntry(id: string): LibraryEntry | null {
  return read().find((e) => e.id === id) ?? null;
}

export function useLibrary(): LibraryEntry[] {
  const [items, setItems] = useState<LibraryEntry[]>(() => read());
  useEffect(() => {
    const sync = () => setItems(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return items;
}

export function useLibraryCount(): number {
  const items = useLibrary();
  return items.length;
}

export function useLibraryActions() {
  const remove = useCallback((id: string) => deleteFromLibrary(id), []);
  return { remove };
}
