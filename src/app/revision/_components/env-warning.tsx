"use client";

export default function EnvWarning() {
  if (typeof window === "undefined") return null;
  // We cannot read server env directly on client; rely on a marker exposed via HTML if desired.
  return null;
}


