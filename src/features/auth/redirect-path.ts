const localOrigin = "https://studyforge.invalid";

export function getSafeRedirectPath(path: string | null | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return "/";
  }

  try {
    const url = new URL(path, localOrigin);
    if (
      url.origin !== localOrigin ||
      url.pathname === "/login" ||
      url.pathname === "/signup" ||
      url.pathname.startsWith("/auth/")
    ) {
      return "/";
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}
