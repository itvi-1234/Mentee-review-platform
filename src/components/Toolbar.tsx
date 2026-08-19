import type { InterviewFilter } from "../types";
import { ClipboardIcon, DownloadIcon, SearchIcon } from "./icons";

interface ToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  filter: InterviewFilter;
  onFilterChange: (value: InterviewFilter) => void;
  onCopyEmails: () => void;
  onDownload: () => void;
}

export function Toolbar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  onCopyEmails,
  onDownload,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="search">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search name or email…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
      <select
        className="filter"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value as InterviewFilter)}
      >
        <option value="all">Everyone</option>
        <option value="called">Called for interview</option>
        <option value="not-called">Not called</option>
      </select>
      <div className="spacer" />
      <div className="toolbar-actions">
        <button className="btn" onClick={onCopyEmails}>
          <ClipboardIcon />
          Copy interview emails
        </button>
        <button className="btn primary" onClick={onDownload}>
          <DownloadIcon />
          Download interview list CSV
        </button>
      </div>
    </div>
  );
}
