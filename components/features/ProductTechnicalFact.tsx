import { Droplet } from 'lucide-react';

interface ProductTechnicalFactProps {
  index: number;
  label: string;
  value: string;
  difficultyScore?: number;
}

function numericValues(value: string) {
  return (value.match(/\d+(?:[.,]\d+)?/g) ?? []).map((part) => Number(part.replace(',', '.')));
}

function clamp(value: number, minimum = 0, maximum = 100) {
  return Math.min(maximum, Math.max(minimum, value));
}

function difficultyPosition(value: string, score?: number) {
  const normalized = value.toLocaleLowerCase('fr');

  if (/interm|moyen/.test(normalized)) return 50;
  if (/avancé|difficile|expert/.test(normalized)) return 86;
  if (/facile|simple|début/.test(normalized)) return 14;
  if (score) return clamp(((score - 1) / 4) * 100);
  return 50;
}

function RangeBar({ position, start }: { position: number; start?: number }) {
  const fillStart = start ?? 0;

  return (
    <div className="relative h-2 border border-primary/30 bg-[#020704]" aria-hidden="true">
      <div
        className="absolute inset-y-0 bg-primary shadow-[0_0_14px_rgba(71,255,131,.8)]"
        style={{ left: `${fillStart}%`, width: `${position - fillStart}%` }}
      />
      {start !== undefined && (
        <span
          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[#dffff0] bg-primary shadow-[0_0_12px_rgba(71,255,131,.9)]"
          style={{ left: `${start}%` }}
        />
      )}
      <span
        className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[#dffff0] bg-primary shadow-[0_0_12px_rgba(71,255,131,.9)]"
        style={{ left: `${position}%` }}
      />
    </div>
  );
}

export function ProductTechnicalFact({ index, label, value, difficultyScore }: ProductTechnicalFactProps) {
  const values = numericValues(value);
  const heading = (
    <span className="font-mono text-[8px] font-extrabold tracking-[0.15em] text-primary">
      0{index + 1} / {label}
    </span>
  );
  const panelClass = 'flex min-h-39.75 flex-col overflow-hidden border border-primary/25 bg-[linear-gradient(135deg,rgba(71,255,131,.075),rgba(7,13,9,.82)_52%)] p-6 xl:min-h-0';

  if (label === 'TEMPÉRATURE') {
    const minimum = values[0] ?? 22;
    const maximum = values[1] ?? minimum;
    const startPosition = clamp(((minimum - 10) / 25) * 100, 8, 92);
    const endPosition = clamp(((maximum - 10) / 25) * 100, startPosition, 92);

    return (
      <article className={panelClass}>
        {heading}
        <strong className="mt-auto text-[clamp(17px,1.5vw,22px)] leading-tight text-[#edf4ef]">{value}</strong>
        <div className="mb-3 mt-6">
          <RangeBar start={startPosition} position={endPosition} />
        </div>
      </article>
    );
  }

  if (label === 'HUMIDITÉ') {
    const humidity = clamp(values.length > 1 ? Math.round((values[0] + values[1]) / 2) : (values[0] ?? 50));

    return (
      <article className={panelClass}>
        {heading}
        <div className="mt-auto flex items-center gap-4 pt-4">
          <div
            className="relative grid h-21 w-21 shrink-0 place-items-center rounded-full shadow-[0_0_18px_rgba(71,255,131,.12)]"
            style={{ background: `conic-gradient(#47ff83 ${humidity}%, rgba(71,255,131,.12) ${humidity}% 100%)` }}
            aria-hidden="true"
          >
            <span className="absolute inset-2 rounded-full border border-primary/20 bg-[#07100a]" />
            <span className="relative text-center font-mono text-xl font-black text-[#edf4ef]">
              {humidity}%
              <small className="block text-[6px] font-bold tracking-[0.12em] text-primary">H₂O</small>
            </span>
          </div>
          <strong className="flex items-center gap-2 text-[clamp(16px,1.4vw,21px)] leading-tight text-[#edf4ef]">
            {value}
            <Droplet className="h-5 w-5 shrink-0 fill-[#6ebcff] text-[#b9ddff]" aria-hidden="true" />
          </strong>
        </div>
      </article>
    );
  }

  const position = difficultyPosition(value, difficultyScore);

  return (
    <article className={panelClass}>
      {heading}
      <strong className="mt-auto text-[clamp(17px,1.5vw,22px)] leading-tight text-[#edf4ef]">{value}</strong>
      <div className="my-6">
        <RangeBar position={position} />
      </div>
      <div className="flex justify-between font-mono text-[6px] font-bold uppercase tracking-widest text-[#829187]">
        <span>Débutant</span>
        <span className="text-primary">Intermédiaire</span>
        <span>Expert</span>
      </div>
    </article>
  );
}