'use client';

import { Banner } from '@/components/ui';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNavbar } from './Mobile/MobileNavbar';
import { Navbar } from './navbar';

export default function Header() {
	const isMobile = useIsMobile();

	return (
		<header className="w-full fixed top-0 left-0 z-50 ">
			{/* Bannière d'information importante */}
			<Banner
				message="
🌡️ Information importante – Expéditions de vivants 
"
				className="justify-center text-center px-4 py-2"
			/>
			{/* Afficher MobileNavbar sur mobile, Navbar sur desktop */}
			{isMobile ? <MobileNavbar /> : <Navbar />}
		</header>
	);
}
