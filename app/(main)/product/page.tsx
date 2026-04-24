'use client';

import { HologramDisplay } from '@/components/features/HologramDisplay';
import { InvertebreCard } from '@/components/features/InvertebreCard';
import { Button } from '@/components/ui/button';
import { useCartContext } from '@/context/CartContext';
import { useSession } from '@/lib/auth.client';
import { Check, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// ============================================
// TYPES
// ============================================
type ProductType = 'invertebré' | 'accessoire';

interface BaseProduct {
	id: string;
	name: string;
	price: number;
	type: ProductType;
	imageUrl: string;
	description: string;
	stock: number;
	category: string;
}

interface InvertebreProduct extends BaseProduct {
	type: 'invertebré';
	origin: string;
	difficulty: 'Facile' | 'Intermédiaire' | 'Expert';
	difficultyLevel: number; // 1-5
	breedingConditions: {
		temperature: string;
		humidity: string;
		substrate: string;
		feeding: string;
	};
	tips: string[];
	temperatureRange: string;
	humidityRange: string;
}

interface AccessoireProduct extends BaseProduct {
	type: 'accessoire';
	features: string[];
	options?: Array<{
		name: string;
		values: string[];
		priceModifier?: number;
	}>;
}

type Product = InvertebreProduct | AccessoireProduct;

// ============================================
// DONNÉES DEMO
// ============================================
const INVERTEBRÉ_DEMO: InvertebreProduct = {
	id: 'inv-001',
	name: 'Armadillidium Vulgare',
	price: 12.99,
	type: 'invertebré',
	imageUrl: '/boite.png',
	category: 'Isopodes',
	description:
		"Espèce robuste et facile d'entretien, idéale pour débuter dans l'élevage d'isopodes. Ces détritivores sont parfaits pour maintenir l'humidité dans les terrariums et participer activement à la décomposition de la matière organique.",
	stock: 25,
	origin: 'Europe centrale',
	difficulty: 'Facile',
	difficultyLevel: 1,
	temperatureRange: '18-24°C',
	humidityRange: '60-80%',
	breedingConditions: {
		temperature: '18-24°C (température ambiante)',
		humidity: '60-80% (substrat légèrement humide)',
		substrate: 'Mélange terre/coco fiber + feuilles mortes',
		feeding: 'Feuilles mortes, légumes, croquettes pour poisson',
	},
	tips: [
		'Prévoir une zone humide et une zone sèche dans le terrarium',
		'Ajouter des cachettes (écorces, pots cassés)',
		'Vaporiser 2-3 fois par semaine',
		'Température stable = reproduction optimale',
	],
};

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const ACCESSOIRE_DEMO: AccessoireProduct = {
	id: 'acc-001',
	name: 'Boîte de Transport Premium',
	price: 8.99,
	type: 'accessoire',
	imageUrl: '/boite.png',
	category: 'Transport',
	description:
		'Boîte de transport isotherme spécialement conçue pour le transport sécurisé de vos invertébrés. Isolation thermique optimale et aération contrôlée pour des trajets sans stress.',
	stock: 50,
	features: [
		'Isolation thermique multi-couches',
		'Aération optimisée avec micro-perforations',
		'Matériau recyclable et résistant',
		'Dimensions : 15x10x8cm',
		'Convient pour 5-10 spécimens',
	],
	options: [
		{
			name: 'Taille',
			values: ['S (10x7x5cm)', 'M (15x10x8cm)', 'L (20x15x10cm)'],
			priceModifier: 2,
		},
		{
			name: 'Pack Gel thermique',
			values: ['Sans gel', 'Avec 1 gel (+2€)', 'Avec 2 gels (+3€)'],
		},
	],
};

// Changez ici pour tester les deux types
const CURRENT_PRODUCT: Product = INVERTEBRÉ_DEMO; // ou ACCESSOIRE_DEMO

// ============================================
// COMPOSANTS COMMUNS
// ============================================

// Bloc section avec style gaming - COMPACTE
function Section({
	title,
	children,
	variant = 'default',
	compact = true,
}: {
	title: string;
	children: React.ReactNode;
	variant?: 'default' | 'premium';
	compact?: boolean;
}) {
	return (
		<div
			className={`${compact ? 'p-2' : 'p-6'} backdrop-blur-sm border rounded-sm ${
				variant === 'premium'
					? 'bg-card/30 border-primary/60 shadow-[0_0_20px_rgba(202,226,197,0.3)]'
					: 'bg-card/20 border-primary/40'
			}`}
			style={{
				clipPath: `polygon(${variant === 'premium' ? '20px' : '15px'} 0, 100% 0, 100% calc(100% - ${variant === 'premium' ? '20px' : '15px'}), calc(100% - ${variant === 'premium' ? '20px' : '15px'}) 100%, 0 100%, 0 ${variant === 'premium' ? '20px' : '15px'})`,
			}}
		>
			<div className='flex items-center gap-2'>
				<h2
					className={`${compact ? 'text-sm md:text-base' : 'text-xl'} font-bold text-foreground uppercase tracking-tight flex items-center gap-2 flex-1`}
				>
					<span className={`w-1 ${compact ? 'h-3.5' : 'h-4'} bg-primary`} />
					{title}
				</h2>
			</div>
			<div className={compact ? 'mt-2' : 'mt-3'}>{children}</div>
		</div>
	);
}

// Badge de difficulté RPG style - optionnel
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function DifficultyBadge({
	difficulty,
	level,
}: {
	difficulty: string;
	level: number;
}) {
	const colors = {
		1: 'from-green-500 to-green-700',
		2: 'from-blue-500 to-blue-700',
		3: 'from-yellow-500 to-yellow-700',
		4: 'from-orange-500 to-orange-700',
		5: 'from-red-500 to-red-700',
	};

	return (
		<div className='inline-flex items-center gap-3 px-4 py-2 bg-linear-to-r from-gray-800 to-gray-900 border-2 border-primary/50 rounded'>
			<div className='flex items-center gap-1'>
				<span className='text-xs text-muted-foreground uppercase tracking-wider'>
					Niveau
				</span>
				<div className='flex gap-0.5 ml-1'>
					{[1, 2, 3, 4, 5].map((star) => (
						<div
							key={star}
							className={`w-3 h-3 ${
								star <= level
									? `bg-linear-to-br ${colors[level as keyof typeof colors]} shadow-[0_0_5px_currentColor]`
									: 'bg-gray-700'
							}`}
							style={{
								clipPath:
									'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
							}}
						/>
					))}
				</div>
			</div>
			<span className='text-sm font-bold text-primary uppercase tracking-wider'>
				{difficulty}
			</span>
		</div>
	);
}

// ============================================
// SECTIONS SPÉCIFIQUES INVERTÉBRÉS
// ============================================

function InvertebreDetails({ product }: { product: InvertebreProduct }) {
	return (
		<Section title="💡 Conseils d'élevage">
			<ul className='space-y-2'>
				{product.tips.map((tip, index) => (
					<li
						key={index}
						className='flex gap-2 text-sm md:text-base text-muted-foreground p-2 bg-primary/5 border border-primary/15 rounded-sm leading-relaxed'
					>
						<span className='text-primary/70 shrink-0 mt-0.5'>▸</span>
						<span>{tip}</span>
					</li>
				))}
			</ul>
		</Section>
	);
}

// ============================================
// SECTIONS SPÉCIFIQUES ACCESSOIRES
// ============================================

function AccessoireDetails({ product }: { product: AccessoireProduct }) {
	const [selectedOptions, setSelectedOptions] = useState<
		Record<string, string>
	>({});

	return (
		<div className='space-y-2'>
			{/* Caractéristiques */}
			<Section
				title='Caractéristiques'
				variant='premium'
				compact
			>
				<ul className='space-y-2'>
					{product.features.map((feature, index) => (
						<li
							key={index}
							className='flex items-start gap-2 text-muted-foreground text-sm md:text-base leading-relaxed'
						>
							<span className='text-primary mt-0.5'>▸</span>
							<span>{feature}</span>
						</li>
					))}
				</ul>
			</Section>

			{/* Options */}
			{product.options && product.options.length > 0 && (
				<Section
					title='Options'
					compact
				>
					<div className='space-y-2'>
						{product.options.map((option) => (
							<div key={option.name}>
								<label className='block text-sm md:text-base font-bold text-foreground uppercase tracking-wider mb-1.5'>
									{option.name}
								</label>
								<select
									className='w-full px-4 py-3 bg-card border border-primary/40 rounded text-sm md:text-base text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
									onChange={(e) =>
										setSelectedOptions({
											...selectedOptions,
											[option.name]: e.target.value,
										})
									}
								>
									{option.values.map((value) => (
										<option
											key={value}
											value={value}
										>
											{value}
										</option>
									))}
								</select>
							</div>
						))}
					</div>
				</Section>
			)}
		</div>
	);
}

// ============================================
// PAGE PRINCIPALE
// ============================================

export default function ProductPageV2() {
	const [quantity, setQuantity] = useState(1);
	const [isAdding, setIsAdding] = useState(false);
	const [added, setAdded] = useState(false);
	const product = CURRENT_PRODUCT;

	const router = useRouter();
	const { data: session } = useSession();
	const { addItem } = useCartContext();

	const handleAddToCart = async () => {
		if (!session?.user) {
			router.push('/login');
			return;
		}
		if (product.stock === 0) return;

		setIsAdding(true);
		try {
			await addItem(product.id, quantity, product.price);
			setAdded(true);
			setQuantity(1);
			setTimeout(() => setAdded(false), 2500);
		} catch (error) {
			console.error('Erreur ajout panier:', error);
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<main className='min-h-screen pb-8'>
			<div className='w-full px-4 md:px-8 pt-20 md:pt-16'>
				{/* Grille compacte : ajuste automatiquement selon l'écran */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4 items-start'>
					{/* COLONNE GAUCHE - Visuel + Panier (lg: 1/3) */}
					<div className='flex flex-col gap-2 lg:col-span-1 order-1 lg:order-1'>
						{product.type === 'invertebré' ? (
							<div className='w-full'>
								<InvertebreCard
									imageUrl={product.imageUrl}
									name={product.name}
									price={product.price}
									category={product.category}
									origin={product.origin}
									difficulty={product.difficulty}
									difficultyLevel={product.difficultyLevel}
									breedingConditions={product.breedingConditions}
								/>
							</div>
						) : (
							<div className='w-full'>
								<HologramDisplay
									imageUrl={product.imageUrl}
									productName={product.name}
									autoRotate={true}
								/>
							</div>
						)}

						{/* Panier - sous la card */}
						<div
							className='p-2 backdrop-blur-sm border bg-card/30 border-primary/60 shadow-[0_0_20px_rgba(202,226,197,0.3)]'
							style={{
								clipPath:
									'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
							}}
						>
							<div className='flex items-center gap-2 mb-2'>
								<div className='flex items-center gap-1'>
									<Button
										variant='outline'
										size='icon'
										className='h-8! w-8! border-primary/50 text-muted-foreground hover:bg-primary/20 hover:text-foreground'
										onClick={() => setQuantity(Math.max(1, quantity - 1))}
									>
										<svg
											className='w-3 h-3'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M20 12H4'
											/>
										</svg>
									</Button>
									<span className='w-6 text-center font-bold text-primary text-sm'>
										{quantity}
									</span>
									<Button
										variant='outline'
										size='icon'
										className='h-8! w-8! border-primary/50 text-muted-foreground hover:bg-primary/20 hover:text-foreground'
										onClick={() =>
											setQuantity(Math.min(product.stock, quantity + 1))
										}
									>
										<svg
											className='w-3 h-3'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M12 4v16m8-8H4'
											/>
										</svg>
									</Button>
								</div>
							
							</div>
							<Button
								onClick={handleAddToCart}
								disabled={isAdding || product.stock === 0}
								className={`w-full py-2 text-xs font-black uppercase tracking-widest transition-all ${
									added
										? 'bg-primary/30 text-primary shadow-[0_0_25px_rgba(202,226,197,0.6)]'
										: product.stock === 0
											? 'opacity-50 cursor-not-allowed'
											: 'shadow-[0_0_15px_rgba(202,226,197,0.4)] hover:shadow-[0_0_30px_rgba(202,226,197,0.6)]'
								}`}
							>
								{isAdding ? (
									<>
										<div className='w-3 h-3 mr-1 animate-spin border border-current border-t-transparent rounded-full' />
										Ajout...
									</>
								) : added ? (
									<>
										<Check className='w-3 h-3 mr-1' />
										Ajouté !
									</>
								) : product.stock === 0 ? (
									'Épuisé'
								) : (
									<>
										<ShoppingCart className='w-3 h-3 mr-1' />
										Ajouter au panier
									</>
								)}
							</Button>
							<div className='pt-1 border-t border-primary/30 flex items-center justify-between text-m mt-2'>
								<span className='text-muted-foreground uppercase tracking-wider'>
									Total
								</span>
								<span className='font-black text-primary font-mono'>
									{(product.price * quantity).toFixed(2)}€
								</span>
							</div>
						</div>
					</div>

					{/* COLONNE DROITE - Description + Conseils + Panier */}
					<div className='space-y-1.5 lg:col-span-2 order-2 lg:order-2'>
						{/* Nom produit - header léger */}

						{/* Description */}
						<Section title='À propos'>
							<p className='text-sm md:text-base text-muted-foreground leading-relaxed'>
								{product.description}
							</p>
						</Section>

						{/* Détails complémentaires */}
						{product.type === 'invertebré' ? (
							<InvertebreDetails product={product} />
						) : (
							<AccessoireDetails product={product} />
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
