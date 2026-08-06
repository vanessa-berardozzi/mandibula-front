import { Fragment } from "react";
import styles from "./SignalTicker.module.css";

type SignalTickerProps = {
  language?: "fr" | "en";
};

const DATA_FLOW_TEXT =
  "01001101 01000001 01001110 01000100 01001001 01000010 01010101 01001100 01000001 // PKT.026 // BIO.DATA // 7F A2 19 C4";

const FR_SEGMENTS = [
  "ÉLEVAGE RESPONSABLE",
  "ESPÈCES NÉES EN CAPTIVITÉ",
  "SUBSTRATS DÉVELOPPÉS EN INTERNE",
  "CONSEILS & EXPERTISE",
] as const;

const EN_SEGMENTS = [
  "RESPONSIBLE BREEDING",
  "CAPTIVE-BRED SPECIES",
  "IN-HOUSE SUBSTRATES",
  "GUIDANCE & EXPERTISE",
] as const;

const getTickerLabel = (language: "fr" | "en") =>
  language === "fr"
    ? "Élevage responsable, espèces nées en captivité, substrats développés en interne, conseils et expertise"
    : "Responsible breeding, captive-bred species, in-house substrates, guidance and expertise";

export function SignalTicker({ language = "fr" }: SignalTickerProps) {
  const segments = language === "fr" ? FR_SEGMENTS : EN_SEGMENTS;
  const groups = [0, 1] as const;

  return (
    <div className={styles["signal-ticker"]} role="marquee" aria-label={getTickerLabel(language)}>
      <div className={styles["signal-data-flow"]} aria-hidden="true">
        {groups.map((index) => (
          <span key={index}>{DATA_FLOW_TEXT}</span>
        ))}
      </div>

      <div className={styles["signal-ticker-track"]} aria-hidden="true">
        {groups.map((groupIndex) => (
          <div className={styles["signal-ticker-group"]} key={groupIndex}>
            <b>MANDIBULA // BIOSYSTEM</b>
            {segments.map((segment) => (
              <Fragment key={`${groupIndex}-${segment}`}>
                <span>{segment}</span>
                <i aria-hidden="true">◆</i>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
