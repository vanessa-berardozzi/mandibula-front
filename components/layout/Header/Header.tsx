'use client';

import { Banner } from '@/components/ui';
import { Navbar } from './navbar';

export default function Header() {
	return (
		<header className="w-full fixed top-0 left-0 z-50 ">
			{/* Bannière d'information importante */}
			<Banner
				message="
🌡️ Information importante – Expéditions de vivants 
"
				className="justify-center text-center px-4 py-2"
			/>
			<Navbar />
		</header>
	);
}
