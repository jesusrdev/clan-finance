export function normalizeDisplayNameInput(value: string): string {
  return value.trim();
}

export function isDisplayNameValid(value: string): boolean {
  return normalizeDisplayNameInput(value).length > 0;
}
