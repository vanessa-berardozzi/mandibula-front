'use client';

import { Banner } from '@/components/ui';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import { MobileNavbar } from './Mobile/MobileNavbar';
import { Navbar } from './navbar';

type BannerConfig = {
	message: string;
	status: 'ACTIVE' | 'PAUSED';
};

const DEFAULT_BANNER: BannerConfig = {
	message:
		'Expéditions du vivant adaptées à la météo Températures trop fortes pour les envois Nos nouveaux substrats sont disponibles ! 💚',
	status: 'PAUSED',
};

export default function Header() {
	const isMobile = useIsMobile();
	const [banner, setBanner] = useState<BannerConfig>(DEFAULT_BANNER);

	useEffect(() => {
		let cancelled = false;

		fetch('/api/banner', { cache: 'no-store' })
			.then(async (response) => {
				if (!response.ok) throw new Error('Bandeau indisponible');
				return (await response.json()) as BannerConfig;
			})
			.then((data) => {
				if (cancelled || !data?.message) return;
				setBanner({
					message: data.message,
					status: data.status === 'PAUSED' ? 'PAUSED' : 'ACTIVE',
				});
			})
			.catch(() => {
				// Bandeau par défaut conservé si l'API est indisponible.
			});

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<header className="w-full fixed top-0 left-0 z-50 ">
			{/* Bandeau d'information système */}
			<Banner message={banner.message} status={banner.status} />
			{/* Afficher MobileNavbar sur mobile, Navbar sur desktop */}
			{isMobile ? <MobileNavbar /> : <Navbar />}
		</header>
	);
}
