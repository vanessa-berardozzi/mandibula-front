"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { FormEvent, useEffect, useState } from "react";

type BannerStatus = "ACTIVE" | "PAUSED";

type BannerPayload = {
  message: string;
  status: BannerStatus;
};

type BannerSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const MAX_LENGTH = 300;

export function BannerSettingsDialog({ open, onOpenChange }: BannerSettingsDialogProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<BannerStatus>("ACTIVE");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    setLoading(true);
    setError("");
    setNotice("");

    fetch("/api/admin/banner", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Bandeau indisponible");
        return (await response.json()) as BannerPayload;
      })
      .then((banner) => {
        if (cancelled) return;
        setMessage(banner.message);
        setStatus(banner.status === "PAUSED" ? "PAUSED" : "ACTIVE");
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger le bandeau actuel.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);

    try {
      const response = await fetch("/api/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), status }),
      });

      if (!response.ok) throw new Error("Enregistrement refusé");

      setNotice("Bandeau mis à jour.");
    } catch {
      setError("Impossible d'enregistrer le bandeau.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border border-sky-500/30 bg-[#020905]/97 text-[#eef5f0]">
        <div>
          <p className="admin-type-micro font-mono uppercase tracking-[0.16em] text-sky-400">
            Control / Bandeau
          </p>
          <DialogTitle className="mt-1.5 font-sans text-[clamp(20px,2.4vw,26px)] font-black tracking-[-0.045em]">
            Message du bandeau
          </DialogTitle>
          <DialogDescription className="admin-type-small mt-2 text-[#819487]">
            Ce texte s&apos;affiche en haut de toutes les pages du site.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="admin-type-micro font-mono uppercase tracking-[0.16em] text-[#7d9985]">
              Message
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value.slice(0, MAX_LENGTH))}
              rows={4}
              required
              disabled={loading || saving}
              className="admin-type-small resize-none border border-admin-border bg-[#040e08]/80 px-3 py-2 text-[#eef5f0] outline-none transition-colors focus:border-sky-400 disabled:opacity-60"
            />
            <span className="admin-type-micro font-mono text-[#5e6f63]">
              {message.length}/{MAX_LENGTH}
            </span>
          </label>

          <label className="flex flex-col gap-2">
            <span className="admin-type-micro font-mono uppercase tracking-[0.16em] text-[#7d9985]">
              Statut
            </span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as BannerStatus)}
              disabled={loading || saving}
              className="admin-type-small min-h-9 border border-admin-border bg-[#040e08]/80 px-3 text-[#eef5f0] outline-none transition-colors focus:border-sky-400 disabled:opacity-60"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="PAUSED">PAUSED (alerte)</option>
            </select>
          </label>

          {error && (
            <p className="admin-type-micro border-l-2 border-[#ff5b5b] pl-3 text-[#ff8a8a]">
              ⚠ {error}
            </p>
          )}
          {notice && (
            <p className="admin-type-micro border-l-2 border-[#70f18b] pl-3 text-[#70f18b]">
              {notice}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <DialogClose className="admin-type-micro min-h-9 border border-admin-border px-4 font-mono uppercase tracking-[0.2em] text-[#7d9985] transition-colors hover:border-admin-green hover:text-admin-green">
              Fermer
            </DialogClose>
            <button
              type="submit"
              disabled={loading || saving || !message.trim()}
              className="admin-type-micro min-h-9 border border-sky-500/50 bg-sky-500/10 px-4 font-mono uppercase tracking-[0.2em] text-sky-300 transition-colors hover:border-sky-400 hover:text-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Envoi…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
