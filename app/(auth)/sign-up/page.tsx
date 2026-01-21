"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
	name: z.string().min(2, "Le nom est requis"),
	email: z.string().email("Email invalide"),
	password: z.string().min(8, "8 caractères minimum"),
});

export default function SignUpPage() {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { name: "", email: "", password: "" },
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL;
		try {
			const res = await fetch(`${apiUrl}/api/auth/sign-up/email`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});
			if (!res.ok) {
				const data = await res.json();
				alert(data?.message || "Erreur lors de l'inscription");
				return;
			}//todo: faire une meilleure popup que alert
			alert("Inscription réussie ! Vérifiez votre email.");
			form.reset();
		} catch {
			alert("Erreur réseau ou serveur. Veuillez réessayer.");
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-background">
			<div className="w-full max-w-md rounded-lg bg-green-400 dark:bg-card p-8 shadow-md">
				<h1 className="mb-6 text-2xl font-bold text-center">
					Créer un compte
				</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nom/ Pseudo</FormLabel>
									<FormControl>
										<Input
											placeholder="Votre nom ou pseudo"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="Votre email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mot de passe</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Mot de passe"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full">
							S&#39;inscrire						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}

