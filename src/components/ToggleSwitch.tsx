interface ToggleSwitchProps {
  on: boolean;
  onToggle: () => void;
  label?: string;
}

export function ToggleSwitch({ on, onToggle }: ToggleSwitchProps) {
  return (
    <div className={`toggle-wrap ${on ? "is-on" : ""}`}>
      <div
        className={`toggle ${on ? "on" : ""}`}
        role="switch"
        aria-checked={on}
        tabIndex={0}
        title="Call for interview"
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="knob" />
      </div>
      <span className="toggle-label">{on ? "Called" : "Call"}</span>
    </div>
  );
}
