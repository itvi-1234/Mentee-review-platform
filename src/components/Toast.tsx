import { CheckIcon } from "./icons";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  return (
    <div className={`toast ${message ? "show" : ""}`}>
      <CheckIcon />
      <span>{message}</span>
    </div>
  );
}
