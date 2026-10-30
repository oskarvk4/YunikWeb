"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ClientCopy } from "@/lib/copy-text";

const CopyContext = createContext<ClientCopy | null>(null);

/**
 * Makes the editable site copy available to client components. The root layout
 * loads it once with getCopy() and wraps the page in this provider.
 */
export function CopyProvider({ copy, children }: { copy: ClientCopy; children: ReactNode }) {
  return <CopyContext.Provider value={copy}>{children}</CopyContext.Provider>;
}

/** The editable site copy (from /admin/copy) in a client component. */
export function useCopy(): ClientCopy {
  const copy = useContext(CopyContext);
  if (!copy) throw new Error("useCopy() must be used inside <CopyProvider>");
  return copy;
}
