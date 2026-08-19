import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cncf-mentee-interview-v1";

function readStorage(): Record<string, true> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useInterviewDecisions() {
  const [decisions, setDecisions] = useState<Record<string, true>>(() => readStorage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
  }, [decisions]);

  const isCalled = useCallback((email: string) => !!decisions[email.toLowerCase()], [decisions]);

  const toggle = useCallback((email: string) => {
    const key = email.toLowerCase();
    if (!key) return;
    setDecisions((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  }, []);

  return { isCalled, toggle };
}
