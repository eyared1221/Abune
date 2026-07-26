export const roles = [
  "SPIRITUAL_FATHER",
  "SPIRITUAL_CHILD",
] as const;

export type AppRole = (typeof roles)[number];

export function isAppRole(value: unknown): value is AppRole {
  return (
    typeof value === "string" &&
    roles.includes(value as AppRole)
  );
}

export function isSpiritualFather(
  value: unknown,
): value is "SPIRITUAL_FATHER" {
  return value === "SPIRITUAL_FATHER";
}

export function isSpiritualChild(
  value: unknown,
): value is "SPIRITUAL_CHILD" {
  return value === "SPIRITUAL_CHILD";
}
