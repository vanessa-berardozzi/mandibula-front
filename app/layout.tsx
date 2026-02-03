import { Sidebar, SidebarProvider } from "@/components/layout/Header/Sidebar/sidebar";
import type { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '../components/layout';
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
						className='object-cover opacity-100'
						draggable={false}
						priority
					/>
					<div />
				</div>
				<SidebarProvider>
					<Header />
					<Sidebar>
						<SidebarContent />
					</Sidebar>
					{children}
				</SidebarProvider>
      </body>
	</html>
  );
}
