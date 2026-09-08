import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://mandibula-back.onrender.com";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/banner`, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json({ error: "Bandeau indisponible" }, { status: res.status });
    }

    return NextResponse.json(await res.json(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[Banner Proxy]", error);
    return NextResponse.json({ error: "Service indisponible" }, { status: 502 });
  }
}
