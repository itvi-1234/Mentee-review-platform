import type { Mentee, SortKey } from "../types";
import { DocIcon } from "./icons";
import { ToggleSwitch } from "./ToggleSwitch";

interface MenteeTableProps {
  mentees: Mentee[];
  sortKey: SortKey;
  sortDir: 1 | -1;
  onSort: (key: SortKey) => void;
  isCalled: (email: string) => boolean;
  onToggle: (email: string) => void;
}

function DocCell({ url }: { url: string | null }) {
  if (!url) return <span className="doc-missing">—</span>;
  return (
    <a className="doc-link" href={url} target="_blank" rel="noopener noreferrer" title={url}>
      <DocIcon />
      View
    </a>
  );
}

export function MenteeTable({ mentees, sortKey, sortDir, onSort, isCalled, onToggle }: MenteeTableProps) {
  function arrow(key: SortKey) {
    if (sortKey !== key) return "";
    return sortDir === 1 ? "↑" : "↓";
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th className="no-sort">#</th>
            <th onClick={() => onSort("name")}>
              Mentee <span className="arrow">{arrow("name")}</span>
            </th>
            <th onClick={() => onSort("email")}>
              Email <span className="arrow">{arrow("email")}</span>
            </th>
            <th className="no-sort">Resume</th>
            <th className="no-sort">Cover Letter</th>
            <th className="no-sort">Inclusive Community</th>
            <th className="no-sort">Interview</th>
          </tr>
        </thead>
        <tbody>
          {mentees.map((m, i) => {
            const called = isCalled(m.email);
            return (
              <tr key={m.email || m.name + i} className={called ? "dec-called" : ""}>
                <td className="sno">{i + 1}</td>
                <td className="name">{m.name}</td>
                <td className="email">
                  <a href={`mailto:${m.email}`}>{m.email}</a>
                </td>
                <td>
                  <DocCell url={m.resume} />
                </td>
                <td>
                  <DocCell url={m.coverLetter} />
                </td>
                <td>
                  <DocCell url={m.inclusiveCommunity} />
                </td>
                <td>
                  <ToggleSwitch on={called} onToggle={() => onToggle(m.email)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
