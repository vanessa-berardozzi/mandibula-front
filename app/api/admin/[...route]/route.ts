import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "https://mandibula-back.onrender.com";

const ALLOWED_METHODS = new Set(["GET", "POST", "PATCH", "DELETE"]);

async function proxy(req: NextRequest, method: string) {
  if (!ALLOWED_METHODS.has(method)) {
    return NextResponse.json({ error: "Méthode non autorisée" }, { status: 405 });
  }

  const path = req.nextUrl.pathname.replace("/api/admin", "");
  const backendUrl = `${BACKEND_URL}/api/admin${path}${req.nextUrl.search}`;

  try {
    const headers = new Headers();
    headers.set("content-type", req.headers.get("content-type") ?? "application/json");
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }

    let body: BodyInit | undefined;
    if (method !== "GET") {
      body = await req.arrayBuffer();
    }

    const res = await fetch(backendUrl, { method, headers, body, cache: "no-store" });

    // On ne relaie jamais le corps d'erreur brut du backend.
    if (!res.ok) {
      return NextResponse.json(
        { error: "Requête admin refusée" },
        { status: res.status, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json(await res.json(), {
      status: res.status,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("[Admin Proxy]", error);
    return NextResponse.json({ error: "Service indisponible" }, { status: 502 });
  }
}

export async function GET(req: NextRequest) {
  return proxy(req, "GET");
}

export async function POST(req: NextRequest) {
  return proxy(req, "POST");
}

export async function PATCH(req: NextRequest) {
  return proxy(req, "PATCH");
}

export async function DELETE(req: NextRequest) {
  return proxy(req, "DELETE");
}
