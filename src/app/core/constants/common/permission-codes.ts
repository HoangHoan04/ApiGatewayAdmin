export type PermissionCode = string;

export const PERMISSION_CODES = {
  HOME_VIEW: 'HOME_VIEW',
} as const satisfies Record<string, PermissionCode>;
