import { BottomNav, Footer, Header, Sidebar, SidebarContent, SidebarProvider } from "@/components/layout"

export default function MainLayout({
	children,
	modal,
}: {
	children: React.ReactNode
	modal: React.ReactNode
}) {
	return (
		<SidebarProvider>
			<Header />
			<Sidebar>
				<SidebarContent />
			</Sidebar>
			{/* Zone principale : même colonne flex que le gap sidebar → s'aligne automatiquement */}
			<div className="flex flex-col flex-1 min-h-svh">
				<div className="flex-1 pb-20 md:pb-0">
					{children}
				</div>
				<Footer />
			</div>
			<div className="md:hidden">
				<BottomNav />
			</div>
			{modal}
		</SidebarProvider>
	)
}

