"use client";

import * as z from "zod";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";

import { AuthProviderButtons } from "./AuthProviderButtons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

// Icônes SVG directement dans les boutons, car utilisées uniquement ici







const formSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  confirmPassword: z.string().min(8, "8 caractères minimum"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

export function SignupFormSheet({
  onSuccess,
  onSwitchToLogin,
}: {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setIsLoading(true)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

    if (!apiUrl) {
      setError("Configuration API manquante (NEXT_PUBLIC_API_URL)")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`${apiUrl}/api/auth/sign-up/email`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      })
      
      if (!res.ok) {
        const data = await res.json()
        setError(data?.message || "Erreur lors de l'inscription")
        return
      }

      // Inscription réussie
      form.reset()
      onSuccess?.()
    } catch {
      setError("Erreur réseau. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="px-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold text-foreground ">Créer un compte</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Entrez vos informations pour créer votre compte
          </p>
        </div>
        {error && (
          <div className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded-md">
            {error}
          </div>
        )}
        <Field>
          <FieldLabel htmlFor="name">Nom / Pseudo</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Votre nom"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-destructive text-sm mt-1">{form.formState.errors.name.message}</p>
          )}
        </Field>
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
          <FieldDescription>
            Nous utiliserons cette adresse pour vous contacter. Nous ne partagerons pas votre email.
          </FieldDescription>
        </Field>
        <Field>
          <Field className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
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
              <FieldLabel htmlFor="confirm-password">
                Confirmer
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-destructive text-sm mt-1">{form.formState.errors.confirmPassword.message}</p>
              )}
            </Field>
          </Field>
          <FieldDescription>
            Minimum 8 caractères.
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit" variant="default" className="w-full" disabled={isLoading}>
            {isLoading ? "Création..." : "Créer mon compte"}
          </Button>
        </Field>
        <FieldSeparator>
          Ou continuer avec
        </FieldSeparator>
        <Field>
          <AuthProviderButtons />
        </Field>
        <FieldDescription className="text-center">
          Déjà un compte ?{" "}
          <Button
            type="button"
            variant="link"
            onClick={onSwitchToLogin}
            className="underline hover:text-foreground transition-colors"
          >
            Se connecter
          </Button>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
