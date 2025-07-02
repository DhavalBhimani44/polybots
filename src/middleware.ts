import { NextRequest, NextResponse } from "next/server";

// Define paths that don't require authentication
const publicPaths = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/trpc(.*)",
  "/api/inngest(.*)",
];

// Define static resource paths that should be skipped
const resourcePaths = ["/_next", "/favicon.ico", "/static"];

/**
 * Check if the path is a public path that doesn't require authentication
 */
function isPublicPath(path: string): boolean {
  return publicPaths.some((publicPath) => {
    if (publicPath.includes("*")) {
      const basePath = publicPath.replace("*", "");
      return path.startsWith(basePath);
    }
    return path === publicPath;
  });
}

/**
 * Check if the path is a static resource path that should skip middleware
 */
function isResourcePath(path: string): boolean {
  return (
    resourcePaths.some((resourcePath) => path.startsWith(resourcePath)) ||
    path.includes(".") || // Files with extensions
    path.startsWith("/api/")
  );
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for static resources
  if (isResourcePath(path)) {
    return NextResponse.next();
  }

  // Check for session cookie
  const hasSessionCookie = request.cookies.has("better-auth.session_token");

  // Handle authentication paths (sign-in and sign-up)
  if (path === "/sign-in" || path === "/sign-up") {
    // If authenticated, redirect to home page
    if (hasSessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If not authenticated, allow access to auth pages
    return NextResponse.next();
  }

  // For public paths, allow access
  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  // For protected routes, check if user is authenticated
  if (!hasSessionCookie) {
    // Redirect to sign-in page with callback URL
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(signInUrl);
  }

  // User is authenticated and accessing a protected route, allow access
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
