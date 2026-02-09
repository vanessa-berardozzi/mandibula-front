"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { AuthProviderButtons } from "./AuthProviderButtons";
// Icônes SVG directement dans les boutons, car utilisées uniquement ici
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
})

export function LoginFormSheet({
  onSuccess,
  onSwitchToSignup,
}: {
  onSuccess?: () => void
  onSwitchToSignup?: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setIsLoading(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    try {
      const res = await fetch(`${apiUrl}/localhost/auth/login/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      
      if (!res.ok) {
        const data = await res.json()
        setError(data?.message || "Email ou mot de passe incorrect")
        return
      }

      // Connexion réussie
      onSuccess?.()
    } catch (e) {
      setError("Erreur réseau. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="px-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-foreground ">Bienvenue</h1>
          <p className="text-muted-foreground text-balance">
            Connectez-vous à votre compte
          </p>
        </div>
        {error && (
          <div className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded-md">
            {error}
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-destructive text-sm mt-1">{form.formState.errors.email.message}</p>
          )}
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
            <button
              type="button"
              className="ml-auto text-sm underline-offset-2 hover:underline color-[var(--foreground)]"
            >
              Mot de passe oublié ?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-destructive text-sm mt-1">{form.formState.errors.password.message}</p>
          )}
        </Field>
        <Field>
          <Button type="submit" variant={"default"} className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Connexion"}
          </Button>
        </Field>
        <FieldSeparator>
          Ou continuer avec
        </FieldSeparator>
        <Field>
          {/* Boutons de connexion via providers (Google, Discord, Facebook) */}
          <AuthProviderButtons />
        </Field>
        <FieldDescription className="text-center">
          Pas de compte ?{" "}
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToSignup}
            className="text-foreground"
          >
            Créer un compte
          </Button>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
