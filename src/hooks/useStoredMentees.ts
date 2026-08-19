import { useEffect, useState } from "react";
import type { Mentee } from "../types";

const STORAGE_KEY = "cncf-mentee-data-v1";

interface StoredData {
  mentees: Mentee[];
  fileLabel: string | null;
}

function readStorage(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { mentees: [], fileLabel: null };
    const parsed = JSON.parse(raw);
    return { mentees: Array.isArray(parsed.mentees) ? parsed.mentees : [], fileLabel: parsed.fileLabel ?? null };
  } catch {
    return { mentees: [], fileLabel: null };
  }
}

export function useStoredMentees() {
  const [data, setData] = useState<StoredData>(() => readStorage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  function setMentees(mentees: Mentee[], fileLabel: string | null) {
    setData({ mentees, fileLabel });
  }

  function clear() {
    setData({ mentees: [], fileLabel: null });
  }

  return { mentees: data.mentees, fileLabel: data.fileLabel, setMentees, clear };
}
