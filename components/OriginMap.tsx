'use client';

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface OriginMapProps {
  label?: string;
  country: string;
  coordinates: [number, number];
  legend?: string;
  className?: string;
}

export default function OriginMap({
  label = '01 / ORIGINE',
  country,
  coordinates,
  legend = 'GÉOLOCALISATION · 1 POINT',
  className = '',
}: OriginMapProps) {
  return (
    <div
      className={`relative h-full min-h-39.75 w-full overflow-hidden border border-primary/25 bg-[linear-gradient(135deg,rgba(71,255,131,.075),rgba(7,13,9,.82)_52%)] ${className}`}
      style={{ aspectRatio: '13 / 7' }}
    >
      <div className="absolute inset-x-2 bottom-9 top-10 overflow-hidden border-t border-primary/10 bg-[#020604]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(71,255,131,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(71,255,131,0.09) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 40%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(ellipse 75% 75% at 50% 50%, black 40%, transparent 90%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 45%, transparent 55%, #020604 100%)' }}
        />
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 190 }}
          width={800}
          height={420}
          className="relative z-10 h-full w-full px-[2%]"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(71,255,131,0.13)"
                stroke="rgba(71,255,131,0.68)"
                strokeWidth={0.7}
              />
            ))}
          </Geographies>

          <Marker coordinates={coordinates}>
            <g>
              <circle r={9} fill="rgba(71,255,131,0.28)" className="animate-ping-slow" />
              <circle r={4.5} fill="#47ff83" stroke="#effff4" strokeWidth={1} />
            </g>
          </Marker>
        </ComposableMap>
      </div>

      <div className="absolute left-6 top-6 font-mono text-[8px] font-extrabold tracking-[0.2em] text-emerald-400/80">
        {label}
      </div>
      <div className="absolute bottom-3 right-5 flex items-center gap-2 font-mono text-[6px] font-extrabold tracking-[0.12em] text-emerald-400/70">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.7)]" />
        {legend}
      </div>
      <div className="absolute bottom-2 left-6 text-xl font-bold leading-none text-white sm:text-2xl">
        {country}.
      </div>

      <style jsx>{`
        @keyframes pingSlow {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        :global(.animate-ping-slow) {
          transform-origin: center;
          animation: pingSlow 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}