"use client";

import { useEffect } from "react";
import { captureLeadSource, LEAD_STORAGE_KEY, parseLeadSource, serializeLeadSource } from "@/lib/lead-source";

/**
 * Records where this visit came from (D110) once per page load: UTM tags, the referring host and
 * the landing path, in sessionStorage only (no cookie; gone when the tab closes). The forms read it
 * on submit (`readLeadSource`). Storage can be blocked (private modes): then nothing is recorded.
 */
export function LeadSourceCapture() {
  useEffect(() => {
    try {
      const existing = parseLeadSource(sessionStorage.getItem(LEAD_STORAGE_KEY));
      const lead = captureLeadSource({ url: location.href, referrer: document.referrer, host: location.hostname, existing });
      sessionStorage.setItem(LEAD_STORAGE_KEY, serializeLeadSource(lead));
    } catch {
      /* storage blocked: the form simply goes without a source */
    }
  }, []);
  return null;
}

/** The recorded source, serialized for the form's `lead` field, or "" when there is none. */
export function readLeadSource(): string {
  try {
    const lead = parseLeadSource(sessionStorage.getItem(LEAD_STORAGE_KEY));
    return lead ? serializeLeadSource(lead) : "";
  } catch {
    return "";
  }
}
