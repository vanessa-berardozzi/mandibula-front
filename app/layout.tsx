import type { Metadata } from "next"
import Image from "next/image"
import "./globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
	title: "Mandibula Shop - Boutique en ligne d'isopodes et blattes",
	description: "Boutique en ligne spécialisée dans la vente d'isopodes, blattes et accessoires pour terrariums. Qualité garantie, expédition sécurisée.",
	keywords: ["isopodes", "blattes", "terrainium", "invertébrés", "élevage", "accessoires"],
	authors: [{ name: "Mandibula Shop" }],
	creator: "Mandibula Shop",
	publisher: "Mandibula Shop",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "fr_FR",
		url: "https://mandibula.shop",
		siteName: "Mandibula Shop",
		title: "Mandibula Shop - Boutique en ligne d'isopodes et blattes",
		description: "Boutique en ligne spécialisée dans la vente d'isopodes, blattes et accessoires pour terrariums.",
		images: [
			{
				url: "https://mandibula.shop/og-image.png",
				width: 1200,
				height: 630,
				alt: "Mandibula Shop",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Mandibula Shop",
		description: "Boutique en ligne d'isopodes et blattes",
		creator: "@mandibula",
		images: ["https://mandibula.shop/twitter-image.png"],
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr">
			<head>
				{/* Preconnect pour optimisation performance */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				
				{/* Canonical URL */}
				<link rel="canonical" href="https://mandibula.shop" />
				
				{/* Icons */}
				<link rel="icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				
				{/* Sitemap et Robots */}
				<link rel="sitemap" href="/sitemap.xml" />
			</head>
			<body>
				<Providers>
					<div className="fixed inset-0 -z-10">
						<Image
							src="/fond_jungle.png"
							alt="Fond jungle apocalyptique"
							fill
							className="object-cover"
							priority
						/>
					</div>
					
					{children}
				</Providers>
			</body>
		</html>
	)
}

