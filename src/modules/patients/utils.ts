type RecordData = Record<string, unknown>;

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});
const shortDateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

export function getString(
  record: RecordData,
  key: string,
  fallback = "Not recorded",
) {
  const value = record[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function formatDate(value: unknown) {
  const date =
    value instanceof Date || typeof value === "string" ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? dateFormatter.format(date)
    : "Date not recorded";
}

export function formatDateOnly(value: unknown) {
  const date =
    value instanceof Date || typeof value === "string" ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? shortDateFormatter.format(date)
    : "No visit recorded";
}

export function getAge(dateOfBirth: Date) {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const hasHadBirthday =
    today.getMonth() > dateOfBirth.getMonth() ||
    (today.getMonth() === dateOfBirth.getMonth() &&
      today.getDate() >= dateOfBirth.getDate());
  if (!hasHadBirthday) age -= 1;
  return age >= 0 ? age : null;
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function getNestedRecords(
  record: RecordData,
  key: string,
): RecordData[] {
  const value = record[key];
  return Array.isArray(value)
    ? value.filter(
        (item): item is RecordData =>
          typeof item === "object" && item !== null && !Array.isArray(item),
      )
    : [];
}

export function getRelatedName(record: RecordData, key: string) {
  const related = record[key];
  return typeof related === "object" &&
    related !== null &&
    "name" in related &&
    typeof related.name === "string"
    ? related.name
    : "Care team member";
}
