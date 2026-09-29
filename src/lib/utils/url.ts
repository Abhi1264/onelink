const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

export function getProfileHost(username: string) {
  return `${ROOT_DOMAIN}/${username}`;
}

export function getProfileUrl(username: string) {
  const protocol = ROOT_DOMAIN.includes("localhost") ? "http" : "https";
  return `${protocol}://${getProfileHost(username)}`;
}

export function getHostname(url: string) {
  try {
    const { hostname, pathname } = new URL(url);
    return hostname.replace(/^www\./, "") || pathname;
  } catch {
    return url;
  }
}

/** Accepts "example.com" style input; returns null for anything that isn't a safe http(s)/mailto link. */
export function normalizeUrl(input: string) {
  const raw = input.trim();
  if (!raw) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`);
    if (url.protocol === "mailto:") return url.pathname.includes("@") ? url.href : null;
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.hostname.includes(".") ? url.href : null;
  } catch {
    return null;
  }
}
