"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "@/lib/auth.client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AuthProviderButtons } from "./AuthProviderButtons"

const formSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
})

type FormValues = z.infer<typeof formSchema>

export function LoginFormSheet({
  onSwitchToSignup,
}: {
  onSwitchToSignup?: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleProviderClick = async (provider: string) => {
    setError(null)
    setIsLoading(true)
    try {
      const { error: authError } = await signIn.social({
        provider: provider as never,
        callbackURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      })
      if (authError) {
        setError(authError.message ?? "Erreur d'authentification")
        setIsLoading(false)
      }
    } catch {
      setError("Erreur lors de la connexion avec " + provider)
      setIsLoading(false)
    }
  }

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: FormValues) {
    setError(null)
    setIsLoading(true)
    try {
      const { error: authError } = await signIn.email({
        email: values.email,
        password: values.password,
      })
      if (authError) {
        setError(authError.message ?? "Email ou mot de passe incorrect")
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
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5 px-1">

      {/* Header */}
      <div className="text-center space-y-2 pb-1">
        <span className="text-[9px] font-mono tracking-[0.28em] text-primary/45 uppercase">Accès sécurisé</span>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">Bienvenue</h1>
        <p className="text-muted-foreground text-sm">Connectez-vous à votre compte</p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="border border-destructive/40 bg-destructive/10 text-destructive text-xs font-mono text-center px-3 py-2 rounded shadow-[0_0_12px_rgba(255,59,59,0.2)]">
          ⚠ {error}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="label-neon">Email</label>
        <Input id="email" type="email" placeholder="m@example.com" className="input-neon" {...register("email")} />
        {errors.email && <p className="text-destructive text-xs font-mono mt-1">{errors.email.message}</p>}
      </div>

      {/* Mot de passe */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="label-neon" style={{ marginBottom: 0 }}>Mot de passe</label>
          <button type="button" className="text-[9px] font-mono tracking-widest text-secondary/70 hover:text-secondary transition-colors uppercase">
            Oublié ?
          </button>
        </div>
        <Input id="password" type="password" className="input-neon" {...register("password")} />
        {errors.password && <p className="text-destructive text-xs font-mono mt-1">{errors.password.message}</p>}
      </div>

      {/* Submit */}
      <Button type="submit" className="w-full btn-neon-primary" disabled={isLoading}>
        {isLoading ? "Connexion..." : "Connexion"}
      </Button>

      {/* Séparateur */}
      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-primary/15" />
        <span className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase shrink-0">Ou continuer avec</span>
        <div className="h-px flex-1 bg-primary/15" />
      </div>

      <AuthProviderButtons onProviderClick={handleProviderClick} />

      {/* Switch */}
      <p className="text-center text-sm text-muted-foreground pt-1">
        Pas de compte ? {" "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-secondary hover:text-secondary/80 hover:underline underline-offset-2 transition-colors"
        >
          Créer un compte →
        </button>
      </p>
    </form>
  )
}
