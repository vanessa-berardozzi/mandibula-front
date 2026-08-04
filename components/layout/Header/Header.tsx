'use client';

import { Banner } from '@/components/ui';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileNavbar } from './Mobile/MobileNavbar';
import { Navbar } from './navbar';

export default function Header() {
	const isMobile = useIsMobile();

	return (
		<header className="w-full fixed top-0 left-0 z-50 ">
			{/* Bandeau d'information système */}
			<Banner message="Expéditions du vivant adaptées à la météo Températures trop fortes pour les envois Nos nouveaux substrats sont disponibles ! 💚" />
			{/* Afficher MobileNavbar sur mobile, Navbar sur desktop */}
			{isMobile ? <MobileNavbar /> : <Navbar />}
		</header>
	);
}
