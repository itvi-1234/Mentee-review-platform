import { useMemo, useRef, useState } from "react";
import { Header } from "./components/Header";
import { Dropzone } from "./components/Dropzone";
import { StatsBar } from "./components/StatsBar";
import { Toolbar } from "./components/Toolbar";
import { MenteeTable } from "./components/MenteeTable";
import { FooterBar } from "./components/FooterBar";
import { Toast } from "./components/Toast";
import { useInterviewDecisions } from "./hooks/useInterviewDecisions";
import { useStoredMentees } from "./hooks/useStoredMentees";
import { useTheme } from "./hooks/useTheme";
import { useToast } from "./hooks/useToast";
import { parseMenteeCSV, buildInterviewCSV } from "./lib/csv";
import type { SortKey, InterviewFilter } from "./types";

export default function App() {
  const { mentees, fileLabel, setMentees } = useStoredMentees();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InterviewFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const { isCalled, toggle } = useInterviewDecisions();
  const { theme, toggle: toggleTheme } = useTheme();
  const { message, show } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseMenteeCSV(String(reader.result));
        setMentees(parsed, `${file.name} · ${parsed.length} mentees`);
        setSortKey("name");
        setSortDir(1);
        show(`Loaded ${parsed.length} mentees from ${file.name}`);
      } catch (err) {
        console.error(err);
        show("Could not parse that file — check it's a valid CSV");
      }
    };
    reader.readAsText(file);
  }

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = mentees.filter((m) => {
      if (q && !m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q)) return false;
      const called = isCalled(m.email);
      if (filter === "called" && !called) return false;
      if (filter === "not-called" && called) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const av = a[sortKey].toLowerCase();
      const bv = b[sortKey].toLowerCase();
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });
    return list;
  }, [mentees, query, filter, isCalled, sortKey, sortDir]);

  const calledCount = useMemo(() => mentees.filter((m) => isCalled(m.email)).length, [mentees, isCalled]);

  function copyInterviewEmails() {
    const emails = mentees.filter((m) => isCalled(m.email)).map((m) => m.email);
    if (!emails.length) {
      show("No mentees called for interview yet");
      return;
    }
    navigator.clipboard.writeText(emails.join(", ")).then(
      () => show(`Copied ${emails.length} email${emails.length === 1 ? "" : "s"} to clipboard`),
      () => show("Could not copy — select manually"),
    );
  }

  function downloadInterviewCSV() {
    const called = mentees.filter((m) => isCalled(m.email));
    if (!called.length) {
      show("No mentees called for interview yet");
      return;
    }
    const csv = buildInterviewCSV(called);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interview-list.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    show(`Downloaded interview-list.csv (${called.length} mentees)`);
  }

  const hasData = mentees.length > 0;

  return (
    <div className="shell">
      <Header
        cohortLabel={fileLabel ?? "no file loaded"}
        hasData={hasData}
        onBrowse={() => fileInputRef.current?.click()}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="visually-hidden-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {!hasData && <Dropzone onFile={handleFile} onBrowse={() => fileInputRef.current?.click()} />}

      {hasData && (
        <div className="dashboard">
          <StatsBar total={mentees.length} called={calledCount} />
          <Toolbar
            query={query}
            onQueryChange={setQuery}
            filter={filter}
            onFilterChange={setFilter}
            onCopyEmails={copyInterviewEmails}
            onDownload={downloadInterviewCSV}
          />
          <MenteeTable
            mentees={filtered}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            isCalled={isCalled}
            onToggle={toggle}
          />
          <FooterBar />
        </div>
      )}

      <Toast message={message} />
    </div>
  );
}
