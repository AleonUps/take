import { useState, useEffect } from 'react';

export interface SparkEntry {
  id: string;
  kind: 'spark';
  thumbnail: string | null;
  grade: string;
  language: string;
  result: {
    objectName: string;
    description: string;
    subjects: Array<{ subject: string; lessonTitle: string }>;
  };
  savedAt: number;
}

export interface RawiEntry {
  id: string;
  kind: 'rawi';
  concept: string;
  countryCode: string;
  countryFlag: string;
  countryName: string;
  grade: string;
  language: string;
  languageName: string;
  result: {
    conceptTitle: string;
    culturalHook: string;
    readingTime: string;
  };
  savedAt: number;
}

export type LibraryEntry = SparkEntry | RawiEntry;

const LIBRARY_KEY = 'educis_library';

function getAll(): LibraryEntry[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function setAll(entries: LibraryEntry[]): void {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(entries));
    window.dispatchEvent(new Event('educis-library-update'));
  } catch {}
}

export function saveToLibrary(entry: Omit<LibraryEntry, 'id' | 'savedAt'>): string {
  const id = crypto.randomUUID();
  const full = { ...entry, id, savedAt: Date.now() } as LibraryEntry;
  setAll([full, ...getAll()]);
  return id;
}

export function deleteFromLibrary(id: string): void {
  setAll(getAll().filter(e => e.id !== id));
}

export function getEntry(id: string): LibraryEntry | null {
  return getAll().find(e => e.id === id) ?? null;
}

export function useLibrary(): LibraryEntry[] {
  const [entries, setEntries] = useState<LibraryEntry[]>(getAll);
  useEffect(() => {
    const sync = () => setEntries(getAll());
    window.addEventListener('educis-library-update', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('educis-library-update', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return entries;
}

export function useLibraryCount(): number {
  return useLibrary().length;
}

export function useLibraryActions() {
  return { remove: deleteFromLibrary };
}
