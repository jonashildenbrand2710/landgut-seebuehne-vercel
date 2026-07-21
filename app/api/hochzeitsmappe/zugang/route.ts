import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  HOCHZEITSMAPPE_ACCESS_COOKIE,
  HOCHZEITSMAPPE_ACCESS_PATH,
  verifyHochzeitsmappeAccessToken
} from "@/lib/hochzeitsmappe-access";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const access = verifyHochzeitsmappeAccessToken(token);

  if (!access || !token) {
    return NextResponse.redirect(
      new URL("/hochzeitsmappe?status=access-invalid#mappe-form", request.url),
      303
    );
  }

  const response = NextResponse.redirect(new URL(HOCHZEITSMAPPE_ACCESS_PATH, request.url), 303);
  const now = Math.floor(Date.now() / 1000);

  response.cookies.set(HOCHZEITSMAPPE_ACCESS_COOKIE, token, {
    httpOnly: true,
    maxAge: Math.max(1, access.exp - now),
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Referrer-Policy", "no-referrer");

  return response;
}
