export type ModerationStatus = "resolved" | "dismissed";

export interface ReportMutation {
  id: string;
  status: ModerationStatus;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseReportMutation(value: unknown): ReportMutation | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id.trim() : "";
  const status = record.status;

  if (!UUID_PATTERN.test(id)) return null;
  if (status !== "resolved" && status !== "dismissed") return null;

  return { id, status };
}
