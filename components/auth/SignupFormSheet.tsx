"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signUp } from "@/lib/auth.client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AuthProviderButtons } from "./AuthProviderButtons"

const formSchema = z
  .object({
    name: z.string().min(2, "Le nom est requis"),
    email: z.string().email("Email invalide"),
    password: z.string().min(8, "8 caractères minimum"),
    confirmPassword: z.string().min(8, "8 caractères minimum"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

export function SignupFormSheet({
  onSwitchToLogin,
}: {
  onSwitchToLogin?: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values: FormValues) {
    setError(null)
    setIsLoading(true)
    try {
      const { error: authError } = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      })
      if (authError) {
        setError(authError.message ?? "Erreur lors de l'inscription")
        return
      }
      window.location.href = "/"
    } catch {
      setError("Une erreur est survenue, veuillez réessayer")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 px-1">

      {/* Header */}
      <div className="text-center space-y-2 pb-1">
        <span className="text-[9px] font-mono tracking-[0.28em] text-primary/45 uppercase">// Nouvelle identité</span>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Créer un compte</h1>
        <p className="text-muted-foreground text-sm">Rejoignez la colonie — inscription gratuite</p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="border border-destructive/40 bg-destructive/10 text-destructive text-xs font-mono text-center px-3 py-2 rounded shadow-[0_0_12px_rgba(255,59,59,0.2)]">
          ⚠ {error}
        </div>
      )}

      {/* Nom */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="label-neon">Nom / Pseudo</label>
        <Input id="name" type="text" placeholder="Votre pseudo" className="input-neon" {...register("name")} />
        {errors.name && <p className="text-destructive text-xs font-mono mt-1">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="label-neon">Email</label>
        <Input id="email" type="email" placeholder="m@example.com" className="input-neon" {...register("email")} />
        {errors.email && <p className="text-destructive text-xs font-mono mt-1">{errors.email.message}</p>}
        <p className="text-[10px] text-muted-foreground font-mono">Adresse confidentielle &mdash; jamais partagée.</p>
      </div>

      {/* Mots de passe */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="password" className="label-neon">Mot de passe</label>
          <Input id="password" type="password" className="input-neon" {...register("password")} />
          {errors.password && <p className="text-destructive text-xs font-mono mt-1">{errors.password.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="label-neon">Confirmer</label>
          <Input id="confirm-password" type="password" className="input-neon" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="text-destructive text-xs font-mono mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground font-mono -mt-2">Minimum 8 caractères.</p>

      {/* Submit */}
      <Button type="submit" variant="default" className="w-full btn-neon-primary" disabled={isLoading}>
        {isLoading ? "Création..." : "Créer mon compte"}
      </Button>

      {/* Séparateur */}
      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-primary/15" />
        <span className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase shrink-0">Ou continuer avec</span>
        <div className="h-px flex-1 bg-primary/15" />
      </div>

      <AuthProviderButtons />

      {/* Switch */}
      <p className="text-center text-sm text-muted-foreground pt-1">
        Déjà un compte ?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-secondary hover:text-secondary/80 hover:underline underline-offset-2 transition-colors"
        >
          ← Se connecter
        </button>
      </p>
    </form>
  )
}

