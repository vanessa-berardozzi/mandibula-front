// components/layout/Header/banner.tsx
import { cn } from "@/lib/utils"; // utilitaire shadcn pour fusionner les classes
import styles from "./banner.module.css";

type BannerStatus = "ACTIVE" | "PAUSED";

interface BannerProps {
  message: string;
  /** Statut système affiché : ACTIVE (par défaut) ou PAUSED (mode alerte visuelle) */
  status?: BannerStatus;
  className?: string;
  /** Libellé technique affiché à gauche du message (esthétique "système") */
  leftLabel?: string;
  /** Libellé de statut affiché à droite du message */
  rightLabel?: string;
}

//TODO: rendre accessible le changement pause/active du banner depuis l'admin

export function Banner({
  message,
  status = "PAUSED",
  className,
  leftLabel,
  rightLabel,
}: BannerProps) {
  const isPaused = status === "PAUSED";

  return (
    <div
      className={cn(styles.shell, isPaused && styles.paused, className)}
      role={isPaused ? "alert" : "status"}
      aria-live="polite"
    >
      {isPaused && (
        <i className={cn(styles.warningTape, styles.tapeLeft)} aria-hidden="true">
          <s />
          <s />
          <s />
        </i>
      )}
      <span>{leftLabel ?? (isPaused ? "ALERTE / EXPÉDITION" : "SYS.01 / LOGISTICS")}</span>
      {isPaused && (
        <b className={styles.warningSign} aria-hidden="true">
          <i>!</i>
        </b>
      )}
      <strong>{message.trim()}</strong>
      {isPaused && (
        <b className={styles.warningSign} aria-hidden="true">
          <i>!</i>
        </b>
      )}
      <span>{rightLabel ?? `STATUS / ${status}`}</span>
      {isPaused && (
        <i className={cn(styles.warningTape, styles.tapeRight)} aria-hidden="true">
          <s />
          <s />
          <s />
        </i>
      )}
    </div>
  );
}

