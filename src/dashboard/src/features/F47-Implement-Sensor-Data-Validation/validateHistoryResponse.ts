import type { HistoryPoint } from '../../types';

// Validates the history response consumed by the dashboard.
// This does not validate sensor payloads at a backend ingestion endpoint.
export function validateHistoryResponse(payload: unknown): HistoryPoint[] {
  if (!Array.isArray(payload)) {
    throw new Error('API lịch sử phải trả về một danh sách điểm đo.');
  }

  return payload.flatMap((item): HistoryPoint[] => {
    if (typeof item !== 'object' || item === null) return [];
    const row = item as Record<string, unknown>;
    const timestamp = row.timestamp ?? row.time;
    const value = Number(row.value);
    return typeof timestamp === 'string' && Number.isFinite(value)
      ? [{ timestamp, value }]
      : [];
  });
}
