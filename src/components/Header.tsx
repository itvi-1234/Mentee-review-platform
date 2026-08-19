import type { Theme } from "../hooks/useTheme";
import { ReplaceIcon, UploadIcon } from "./icons";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  cohortLabel: string;
  hasData: boolean;
  onBrowse: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ cohortLabel, hasData, onBrowse, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="top">
      <div className="brand">
        <div className="brand-mark">M</div>
        <div>
          <h1>Mentee Review Console</h1>
          <p>
            Upload the mentee export, mark who&rsquo;s called in &mdash; <span className="cohort-name">{cohortLabel}</span>
          </p>
        </div>
      </div>
      <div className="file-controls">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        {hasData && (
          <button className="btn" onClick={onBrowse} title="Load a different CSV">
            <ReplaceIcon />
            Replace CSV
          </button>
        )}
        <button className="btn primary" onClick={onBrowse} title="Load a mentee CSV">
          <UploadIcon />
          Upload CSV
        </button>
      </div>
    </header>
  );
}
