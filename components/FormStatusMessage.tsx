"use client";

import { useSearchParams } from "next/navigation";

// Liest den status-Query-Parameter clientseitig, damit die umgebende Seite
// statisch vorgerendert bleiben kann.
export function FormStatusMessage({ messages }: { messages: Record<string, string> }) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = status ? messages[status] : undefined;

  if (!message) return null;

  return (
    <p className="bewerbung-form-message bewerbung-form-message-error" role="alert">
      {message}
    </p>
  );
}
