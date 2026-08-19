interface StatsBarProps {
  total: number;
  called: number;
}

export function StatsBar({ total, called }: StatsBarProps) {
  return (
    <div className="stats">
      <div className="stat total">
        <div className="num">{total}</div>
        <div className="lbl">Total mentees</div>
      </div>
      <div className="stat called">
        <div className="num">{called}</div>
        <div className="lbl">Called for interview</div>
      </div>
      <div className="stat remaining">
        <div className="num">{total - called}</div>
        <div className="lbl">Not yet decided</div>
      </div>
    </div>
  );
}
