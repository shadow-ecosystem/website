import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const url = req.nextUrl;
	const hostname = req.headers.get("host") || "";

	// Environment variables for domains
	const isDev = process.env.NODE_ENV === "development";

	// You can set BASE_DOMAIN in .env
	// dev: BASE_DOMAIN=dev.shadow.com.bd
	// prod: BASE_DOMAIN=shadow.com.bd
	const baseDomain =
		process.env.BASE_DOMAIN || (isDev ? "localhost:3000" : "shadow.com.bd");

	// List of apps to map in development
	const apps = ["studio"];

	// In production (or if testing subdomains locally via hosts file)
	if (!isDev && hostname.endsWith(`.${baseDomain}`)) {
		// Extract the full subdomain string: e.g. "something.studio" from "something.studio.shadow.com.bd"
		const subdomainStr = hostname.replace(`.${baseDomain}`, "");

		// Split and reverse to map "something.studio" to "/studio/something"
		const subdomains = subdomainStr.split(".").reverse();
		const internalRoute = `/${subdomains.join("/")}`;

		// Rewrite the request to the internal folder structure
		url.pathname = `${internalRoute}${url.pathname}`;

		return NextResponse.rewrite(url);
	}

	// In development, no rewrite is needed because the user hits /studio directly

	return NextResponse.next();
}

export const config = {
	// Match all request paths except for the ones starting with:
	// - api (API routes)
	// - _next/static (static files)
	// - _next/image (image optimization files)
	// - favicon.ico (favicon file)
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
