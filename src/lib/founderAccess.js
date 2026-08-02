export const FOUNDER_EMAIL = "lilmunofficial18@gmail.com";

export function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

export function isFounderUser(user) {
  return normalizeEmail(user?.email) === normalizeEmail(FOUNDER_EMAIL);
}

export function getFounderDisplayName(user) {
  const metadata = user?.user_metadata ?? {};

  return (
    metadata.display_name ||
    metadata.full_name ||
    metadata.name ||
    "LilMun"
  );
}
