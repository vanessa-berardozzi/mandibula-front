import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Polices exposées en variables CSS et mappées vers --font-sans/--font-mono dans globals.css
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
	title: "Mandibula Shop - Boutique en ligne d'isopodes et blattes",
	description: "Boutique en ligne spécialisée dans la vente d'isopodes, blattes et accessoires pour terrariums. Qualité garantie, expédition sécurisée.",
	keywords: ["isopodes", "blattes", "terrainium", "invertébrés", "élevage", "accessoires"],
	authors: [{ name: "Vanessa Berardozzi" }],
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
		url: "https://dev.mandibula.lu",
		siteName: "Mandibula Shop",
		title: "Mandibula Shop - Boutique en ligne d'isopodes et blattes",
		description: "Boutique en ligne spécialisée dans la vente d'isopodes, blattes et accessoires pour terrariums.",
		images: [
			{
				//todo: mettre à jour l'adresse de l'image Open Graph avec la bonne URL
				url: "https://dev.mandibula.lu",
				width: 1200,
				height: 630,
				alt: "Mandibula Shop",
			},
		],
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
				<link rel="canonical" href="https://mandibula.lu" />
				
				{/* Icons */}
				<link rel="icon" href="/favicon.ico" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				
				{/* Sitemap et Robots */}
				<link rel="sitemap" href="/sitemap.xml" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<Providers>{children}</Providers>
				<Analytics />
			</body>
		</html>
	)
}

