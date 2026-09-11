import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  HOCHZEITSMAPPE_ACCESS_COOKIE,
  HOCHZEITSMAPPE_ACCESS_PATH,
  verifyHochzeitsmappeAccessToken
} from "@/lib/hochzeitsmappe-access";
import { META_EVENT_NAME } from "@/lib/meta-events";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const access = verifyHochzeitsmappeAccessToken(token);

  if (!access || !token) {
    return NextResponse.redirect(new URL("/hochzeitsmappe", request.url), 303);
  }

  const destination = new URL(HOCHZEITSMAPPE_ACCESS_PATH, request.url);
  const metaEvent = request.nextUrl.searchParams.get("meta_event");
  const eventId = request.nextUrl.searchParams.get("event_id")?.trim() || "";
  const funnel = request.nextUrl.searchParams.get("funnel");

  if (
    metaEvent === META_EVENT_NAME &&
    funnel === "hochzeitsmappe" &&
    /^[a-z0-9_:-]{1,160}$/i.test(eventId)
  ) {
    destination.searchParams.set("meta_event", META_EVENT_NAME);
    destination.searchParams.set("event_id", eventId);
    destination.searchParams.set("funnel", "hochzeitsmappe");
  }

  const response = NextResponse.redirect(destination, 303);
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
