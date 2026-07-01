"use client";


interface StatBox {
  label: string;
  value: string | number;
  icon: string;
  color?: "primary" | "secondary" | "accent";
}

interface UserStatsProps {
  stats: StatBox[];
}

export function UserStats({ stats }: UserStatsProps) {
  const getColorClass = (color?: string) => {
    switch (color) {
      case "secondary":
        return "text-secondary";
      case "accent":
        return "text-accent-foreground";
      case "primary":
      default:
        return "text-primary";
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="relative p-4 bg-card/30 backdrop-blur border border-primary/30 rounded-sm hover:border-primary/60 shadow-[0_0_15px_rgba(216,249,153,0.1)] transition-all duration-300"
          style={{
            clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)"
          }}
        >
          {/* Coins */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-primary/40" />
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-primary/40" />

          <div className="space-y-2">
            <div className={`text-2xl ${getColorClass(stat.color)}`}>{stat.icon}</div>
            <p className="text-xs text-muted-foreground uppercase">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
