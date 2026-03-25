export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen flex items-stretch justify-end">
			<div className="flex-1" />
			<div className="auth-panel w-full max-w-md min-h-screen flex flex-col justify-center backdrop-blur-xl border-l border-primary/20 shadow-[-20px_0_60px_rgba(0,0,0,0.5)] px-8 py-12">
				{children}
			</div>
		</div>
	)
}

