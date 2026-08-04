import styles from "./SignalTicker.module.css";

// Message défilant en boucle — bandeau d'ambiance "système" affiché sous le hero.
// Purement décoratif : masqué aux lecteurs d'écran pour éviter la répétition du texte.
const TICKER_TEXT =
  "MANDIBULA // BIOSYSTEM · ÉLEVAGE RESPONSABLE · ESPÈCES NÉES EN CAPTIVITÉ · SUBSTRATS DÉVELOPPÉS EN INTERNE · CONSEILS & EXPERTISE";

export function SignalTicker() {
  return (
    <div className={styles["signal-ticker"]} aria-hidden="true">
      {/* Fond binaire défilant en arrière-plan */}
      <div className={styles["signal-data-flow"]} />

      {/* Piste de texte en boucle infinie : deux groupes identiques accolés,
          l'animation translate de -50% donne l'illusion d'un défilement continu. */}
      <div className={styles["signal-ticker-track"]}>
        <div className={styles["signal-ticker-group"]}>
          <span>{TICKER_TEXT}</span>
        </div>
        <div className={styles["signal-ticker-group"]}>
          <span>{TICKER_TEXT}</span>
        </div>
      </div>

      {/* Balayage lumineux qui traverse le bandeau */}
      <div className={styles["signal-scan"]} />
    </div>
  );
}
