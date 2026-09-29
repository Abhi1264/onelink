const RESERVED = new Set(["admin", "api", "app", "login", "signup", "www"]);

export function usernameError(name: string): string | null {
  if (name.length < 3) return "Use at least 3 characters.";
  if (name.length > 30) return "Use 30 characters or fewer.";
  if (!/^[a-z0-9_-]+$/.test(name)) return "Only lowercase letters, numbers, - and _.";
  if (RESERVED.has(name)) return "That username is reserved.";
  return null;
}

export function toUsername(name: string, email: string) {
  if (!usernameError(name)) return name;
  const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 20);
  return `${base || "user"}-${crypto.randomUUID().slice(0, 4)}`;
}
