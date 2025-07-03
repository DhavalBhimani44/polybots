import { NextRequest, NextResponse } from "next/server";

// Define public paths as regexes
const publicPaths = [
  /^\/$/,
  /^\/sign-in(\/.*)?$/,
  /^\/sign-up(\/.*)?$/,
  /^\/api\/inngest(\/.*)?$/,
  /^\/pricing(\/.*)?$/,
];

// Static resources to skip
const resourcePaths = ["/_next", "/favicon.ico", "/static"];

function isPublicPath(path: string): boolean {
  return publicPaths.some((regex) => regex.test(path));
}

function isResourcePath(path: string): boolean {
  return (
    resourcePaths.some((resourcePath) => path.startsWith(resourcePath)) ||
    path.includes(".") ||
    path.startsWith("/api/")
  );
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (isResourcePath(path)) return NextResponse.next();

  const hasSessionCookie =
    request.cookies.has("__Secure-better-auth.session_token") ||
    request.cookies.has("better-auth.session_token"); // for local/dev fallback

  if (path === "/sign-in" || path === "/sign-up") {
    if (hasSessionCookie)
      return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (isPublicPath(path)) return NextResponse.next();

  if (!hasSessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
