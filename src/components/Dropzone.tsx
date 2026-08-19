import { useState, type DragEvent } from "react";
import { UploadIcon } from "./icons";

interface DropzoneProps {
  onFile: (file: File) => void;
  onBrowse: () => void;
}

export function Dropzone({ onFile, onBrowse }: DropzoneProps) {
  const [dragging, setDragging] = useState(false);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div
      className={`dropzone ${dragging ? "drag" : ""}`}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragging(false);
      }}
      onDrop={handleDrop}
    >
      <div className="glyph">
        <UploadIcon />
      </div>
      <h2>Drop a mentee CSV here</h2>
      <button className="btn primary" onClick={onBrowse}>
        <UploadIcon />
        Choose file
      </button>
    </div>
  );
}
