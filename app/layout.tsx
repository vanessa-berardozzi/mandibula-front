import type { Metadata } from "next"
import Image from "next/image"
import "./globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
	title: "Mandibula Shop",
	description: "Boutique en ligne spécialisée dans la vente d'isopodes, blattes et accessoires pour terrariums.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="fr">
			<body>
				<Providers>
					<div className="fixed inset-0 -z-10">
						<Image
							src="/fond_jungle.png"
							alt=""
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

