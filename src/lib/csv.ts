import type { Mentee } from "../types";

/** RFC4180-ish CSV parser: handles quoted fields, embedded commas and newlines. */
function parseRows(text: string): string[][] {
  const normalized = text.replace(/^﻿/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i++) {
    const c = normalized[i];
    if (inQuotes) {
      if (c === '"') {
        if (normalized[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

function findColumn(index: Record<string, number>, names: string[]): number {
  for (const name of names) {
    const key = name.toLowerCase();
    if (key in index) return index[key];
  }
  return -1;
}

export function parseMenteeCSV(text: string): Mentee[] {
  const rows = parseRows(text);
  if (!rows.length) return [];

  const header = rows[0].map((h) => h.trim());
  const index: Record<string, number> = {};
  header.forEach((h, i) => {
    index[h.toLowerCase()] = i;
  });

  const iFirst = findColumn(index, ["firstname", "first name"]);
  const iLast = findColumn(index, ["lastname", "last name"]);
  const iEmail = findColumn(index, ["email"]);
  const fileIdx = header.reduce<number[]>((acc, h, i) => {
    if (/^file_?\d+$/i.test(h)) acc.push(i);
    return acc;
  }, []);

  const mentees: Mentee[] = [];

  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    if (!cells || cells.every((c) => c.trim() === "")) continue;

    const first = iFirst >= 0 ? (cells[iFirst] || "").trim() : "";
    const last = iLast >= 0 ? (cells[iLast] || "").trim() : "";
    const email = iEmail >= 0 ? (cells[iEmail] || "").trim() : "";

    const docs: Record<string, string | null> = {
      Resume: null,
      "Cover Letter": null,
      "Inclusive Community": null,
    };

    fileIdx.forEach((fi) => {
      const raw = (cells[fi] || "").trim();
      if (!raw) return;
      const labeled = raw.match(/^([^:]+):\s*(https?:\/\/\S+)$/i);
      let label: string;
      let url: string;
      if (labeled) {
        label = labeled[1].trim();
        url = labeled[2].trim();
      } else {
        const bare = raw.match(/https?:\/\/\S+/i);
        if (!bare) return;
        label = "File";
        url = bare[0];
      }
      docs[label] = url;
    });

    mentees.push({
      name: (first + " " + last).trim() || "—",
      email,
      resume: docs["Resume"],
      coverLetter: docs["Cover Letter"],
      inclusiveCommunity: docs["Inclusive Community"],
    });
  }

  return mentees;
}

function csvEscape(value: string): string {
  const v = String(value || "");
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function buildInterviewCSV(mentees: Mentee[]): string {
  const header = ["Name", "Email", "Resume", "Cover Letter", "Inclusive Community"];
  const lines = [header.join(",")];
  mentees.forEach((m) => {
    lines.push(
      [m.name, m.email, m.resume || "", m.coverLetter || "", m.inclusiveCommunity || ""]
        .map(csvEscape)
        .join(","),
    );
  });
  return lines.join("\n");
}
