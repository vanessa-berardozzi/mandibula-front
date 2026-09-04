import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy pour POST /api/vat/[...route] (calculate, validate-number, etc.)
 * Redirige vers le backend en préservant l'authentification.
 *
 * Même pattern que les autres proxys du projet (ex: wishlist), avec en plus
 * la gestion du chemin dynamique pour couvrir tous les sous-endpoints TVA
 * sans avoir à créer un fichier par route.
 */
async function makeProxyRequest(
	req: NextRequest,
	method: string,
	routeSegments: string[],
) {
	const path = routeSegments.join('/'); // ex: "calculate" ou "validate-number"
	const backendUrl = `${
		process.env.BACKEND_URL || 'https://mandibula-back.onrender.com'
	}/api/vat/${path}`;

	const cookieHeader = req.headers.get('cookie');

	try {
		const headers = new Headers(req.headers);
		headers.delete('host');

		if (cookieHeader) {
			headers.set('cookie', cookieHeader);
		}

		let body: BodyInit | undefined;
		if (method !== 'GET' && method !== 'HEAD') {
			body = await req.arrayBuffer();
		}

		const res = await fetch(backendUrl, {
			method,
			headers,
			body,
			credentials: 'include',
		});

		const data = await res.json();
		return NextResponse.json(data, { status: res.status });
	} catch (error) {
		console.error('[VAT Proxy Error]', error);
		return NextResponse.json(
			{ error: 'Proxy error', details: String(error) },
			{ status: 500 },
		);
	}
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ route: string[] }> },
) {
	const { route } = await params;
	return makeProxyRequest(req, 'POST', route);
}