import { Sidebar, SidebarProvider } from "@/components/layout/Header/Sidebar/sidebar";
import type { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '../components/layout';
import { BottomNav } from '../components/layout/Header/Mobile/BottomNav';
import { SidebarContent } from '../components/layout/Header/Sidebar/SidebarContent';
import './globals.css';



export const metadata: Metadata = {
	title: 'Mandibula shop ',
	description: 'Boutique en ligne spécialisée dans la vente d\'isopodes, blattes et accessoires pour terrariums.',
};

export default function RootLayout({children}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='fr'>
				<head />
			<body>
	
				{/* Fond jungle en absolute/fixed */}
				<div className='fixed inset-0 -z-10'>
					<Image
						src='/fond_jungle.png'
						alt='Jungle futuriste'
						fill
						className='object-cover '
						draggable={false}
						priority
					/>
					<div />
				</div>
				<SidebarProvider>
					<Header />
					{/* Sidebar visible uniquement sur desktop */}
					<div className="hidden md:block">
						<Sidebar>
							<SidebarContent />
						</Sidebar>
					</div>
					{/* Contenu principal avec padding bottom sur mobile pour le BottomNav */}
					<div className="pb-20 md:pb-0">
						{children}
					</div>
					{/* BottomNav visible uniquement sur mobile */}
					<div className="md:hidden">
						<BottomNav />
					</div>
				</SidebarProvider>
      </body>
	</html>
  );
}
