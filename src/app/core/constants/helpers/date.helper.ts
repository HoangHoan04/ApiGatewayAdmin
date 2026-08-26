import { enumData } from '../enums/enumData';

export type TranslateFn = (key: string, params?: Record<string, unknown>) => string;
export type DayOfWeekMeta = (typeof enumData.DAY_OF_WEEK)[keyof typeof enumData.DAY_OF_WEEK];
export type MonthMeta = (typeof enumData.MONTH)[keyof typeof enumData.MONTH];

const DAY_OF_WEEK_LIST = Object.values(enumData.DAY_OF_WEEK) as DayOfWeekMeta[];
const MONTH_LIST = Object.values(enumData.MONTH) as MonthMeta[];

export function parseDate(value: Date | string | number | null | undefined): Date | null {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function resolveLabel(labelKey: string, translate?: TranslateFn): string {
  return translate ? translate(labelKey) : labelKey;
}

export function getDayOfWeekMeta(
  value: Date | string | number | null | undefined,
): DayOfWeekMeta | null {
  const date = parseDate(value);
  if (!date) return null;
  return DAY_OF_WEEK_LIST.find((item) => item.value === date.getDay()) ?? null;
}

export function getMonthMeta(value: Date | string | number | null | undefined): MonthMeta | null {
  const date = parseDate(value);
  if (!date) return null;
  return MONTH_LIST.find((item) => item.value === date.getMonth()) ?? null;
}

export function toUtcDateIso(value: Date | string | number): string {
  const date = new Date(value);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
}

export function toUtcDateIsoOrNull(
  value: Date | string | number | null | undefined,
): string | null {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return null;
  return toUtcDateIso(value);
}

export function toDateOnly(value: Date | string | number): string {
  const date = new Date(value);
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function toDateOnlyOrNull(value: Date | string | number | null | undefined): string | null {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return null;
  return toDateOnly(value);
}

export function toDateTimeIso(value: Date | string | number): string {
  return new Date(value).toISOString();
}

export function toDateTimeIsoOrNull(
  value: Date | string | number | null | undefined,
): string | null {
  if (value == null || (typeof value === 'string' && value.trim() === '')) return null;
  return toDateTimeIso(value);
}

export function formatDate(
  value: Date | string | number | null | undefined,
  fallback = '-',
): string {
  const date = parseDate(value);
  if (!date) return fallback;
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatTime(
  value: Date | string | number | null | undefined,
  fallback = '-',
): string {
  const date = parseDate(value);
  if (!date) return fallback;
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function formatTimeFull(
  value: Date | string | number | null | undefined,
  fallback = '-',
): string {
  const date = parseDate(value);
  if (!date) return fallback;
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

export function formatDateTime(
  value: Date | string | number | null | undefined,
  fallback = '-',
): string {
  const date = parseDate(value);
  if (!date) return fallback;
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function formatDateTimeFull(
  value: Date | string | number | null | undefined,
  fallback = '-',
): string {
  const date = parseDate(value);
  if (!date) return fallback;
  return `${formatDate(date)} ${formatTimeFull(date)}`;
}

export function formatMonthYear(
  value: Date | string | number | null | undefined,
  fallback = '-',
): string {
  const date = parseDate(value);
  if (!date) return fallback;
  return `${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

export function formatMonthYearLabel(
  value: Date | string | number | null | undefined,
  translate?: TranslateFn,
  fallback = '-',
): string {
  const date = parseDate(value);
  const meta = getMonthMeta(date);
  if (!date || !meta) return fallback;
  return `${resolveLabel(meta.label, translate)}/${date.getFullYear()}`;
}

export function formatYear(
  value: Date | string | number | null | undefined,
  fallback = '-',
): string {
  const date = parseDate(value);
  if (!date) return fallback;
  return String(date.getFullYear());
}

export function formatDayOfWeek(
  value: Date | string | number | null | undefined,
  translate?: TranslateFn,
  fallback = '-',
): string {
  const meta = getDayOfWeekMeta(value);
  if (!meta) return fallback;
  return resolveLabel(meta.label, translate);
}

export function formatDateWithDayOfWeek(
  value: Date | string | number | null | undefined,
  translate?: TranslateFn,
  fallback = '-',
): string {
  const date = parseDate(value);
  if (!date) return fallback;
  return `${formatDayOfWeek(date, translate)}, ${formatDate(date)}`;
}

export function formatDateRange(
  from: Date | string | number | null | undefined,
  to: Date | string | number | null | undefined,
  fallback = '-',
): string {
  const fromText = formatDate(from, '');
  const toText = formatDate(to, '');
  if (!fromText && !toText) return fallback;
  if (!fromText) return toText;
  if (!toText) return fromText;
  return `${fromText} - ${toText}`;
}

export function formatDateCustom(
  value: Date | string | number | null | undefined,
  options: Intl.DateTimeFormatOptions,
  locale = 'vi-VN',
  fallback = '-',
): string {
  const date = parseDate(value);
  if (!date) return fallback;
  return new Intl.DateTimeFormat(locale, options).format(date);
}
