import { Header } from "@/components/layout"
import { BottomNav } from "@/components/layout/Header/Mobile/BottomNav"
import { Sidebar, SidebarProvider } from "@/components/layout/Header/Sidebar/sidebar"
import { SidebarContent } from "@/components/layout/Header/Sidebar/SidebarContent"

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
			<div className="hidden md:block">
				<Sidebar>
					<SidebarContent />
				</Sidebar>
			</div>
			<div className="pb-20 md:pb-0">{children}</div>
			<div className="md:hidden">
				<BottomNav />
			</div>
			{modal}
		</SidebarProvider>
	)
}

