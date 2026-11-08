import type { Locale, Service } from "@/content";

/** What every signature module receives (docs/plans/phase-2-services.md, Task 2.4). */
export interface ModuleProps {
  service: Service;
  locale: Locale;
}
