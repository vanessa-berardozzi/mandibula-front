"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient, useSession } from "@/lib/auth.client";
import { useRef, useState } from "react";

interface EditProfileSheetProps {
  children: React.ReactNode;
}

export function EditProfileSheet({ children }: EditProfileSheetProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lecture de pictureProfile depuis la session (champ custom better-auth)
  const currentPicture =
    (session?.user as { pictureProfile?: string } | undefined)?.pictureProfile ||
    session?.user?.image ||
    null;

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setName(session?.user?.name ?? "");
      setPreviewUrl(currentPicture);
      setSelectedFile(null);
      setError(null);
    } else {
      // Libérer le blob URL pour éviter les fuites mémoire
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    }
    setOpen(isOpen);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 2 Mo");
      return;
    }

    setError(null);
    // Blob URL locale pour l'aperçu — jamais envoyée au serveur
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Le nom ne peut pas être vide");
      return;
    }

    setIsLoading(true);
    try {
      // Étape 1 : upload vers Cloudinary si un nouveau fichier est sélectionné
      // Le backend persiste l'URL dans `pictureProfile` (pas dans `image`)
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);

        const uploadRes = await fetch("/api/upload/avatar", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!uploadRes.ok) {
          const data = await uploadRes.json().catch(() => ({}));
          setError(
            (data as { error?: string }).error ??
              "Erreur lors de l'upload de l'image"
          );
          return;
        }
        // L'URL Cloudinary est maintenant en DB — la session sera rafraîchie à l'étape 2
      }

      // Étape 2 : mettre à jour le nom via better-auth
      // authClient.updateUser force better-auth à relire la DB entière →
      // la nouvelle session inclut pictureProfile mis à jour à l'étape 1
      const result = await authClient.updateUser({ name: name.trim() });

      if (result.error) {
        setError(result.error.message ?? "Erreur lors de la mise à jour");
        return;
      }

      setOpen(false);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const initials = (session?.user?.name ?? "U").charAt(0).toUpperCase();

  return (

    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        className="bg-card/95 backdrop-blur-md border-l-2 border-primary/60 flex flex-col gap-0 p-0"
        style={{ boxShadow: "-4px 0 40px rgba(146, 204, 10, 0.15)" }}
      >
        {/* Décoration gaming */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-80" />
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />

        <SheetHeader className="px-6 pt-8 pb-4 border-b border-primary/20">
          <SheetTitle className="text-primary font-bold text-xl tracking-wide">
            Modifier le profil
          </SheetTitle>
          <p className="text-muted-foreground text-sm">
            Mettez à jour votre nom et votre photo de profil.
          </p>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 px-6 py-6 flex-1 overflow-y-auto"
        >
          {/* Photo de profil */}
          <div className="flex flex-col gap-3">
            <Label className="text-foreground">Photo de profil</Label>
            <div className="flex items-center gap-4">
              {/* Aperçu — <img> standard pour les blob: URLs locales avant upload */}
              <div
                className="relative w-20 h-20 rounded-sm border-2 border-primary/60 overflow-hidden bg-accent/40 shrink-0 cursor-pointer group"
                style={{ boxShadow: "inset 0 0 15px rgba(146, 204, 10, 0.15)" }}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    alt="Aperçu photo de profil"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-primary">
                    {initials}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-primary text-xs font-semibold">
                    Changer
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-primary/50 text-primary hover:bg-primary/10 rounded-sm text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choisir une image
                </Button>
                {selectedFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground text-xs"
                    onClick={() => {
                      if (previewUrl?.startsWith("blob:"))
                        URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(currentPicture);
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Annuler le changement
                  </Button>
                )}
                <p className="text-muted-foreground text-xs">
                  JPG, PNG, GIF — max 2 Mo
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Nom */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-name" className="text-foreground">
              Nom d&apos;utilisateur
            </Label>
            <Input
              id="edit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              maxLength={50}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="px-3 py-2 bg-red-500/10 border border-red-500/40 rounded-sm text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-auto pt-4 border-t border-primary/20">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-semibold"
            >
              {isLoading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="border-primary/50 text-primary hover:bg-primary/10 rounded-sm"
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

