import { BottomNav, Footer, Header } from "@/components/layout"

export default function MainLayout({
	children,
	modal,
}: {
	children: React.ReactNode
	modal: React.ReactNode
}) {
	return (
		<>
			<Header />
			{/* Zone principale : plus de sidebar, navigation entièrement portée par la navbar */}
			<div className="flex flex-col flex-1 min-h-svh">
				<div className="flex-1 pt-24 md:pt-32 pb-20 md:pb-0">
					{children}
				</div>
				<Footer />
			</div>
			<div className="md:hidden">
				<BottomNav />
			</div>
			{modal}
		</>
	)
}

