// components/ui/Banner.tsx
import { cn } from "@/lib/utils"; // utilitaire shadcn pour fusionner les classes

export function Banner({ message, className }: { message: string; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex items-center border border-blue/10 bg-white/10 backdrop-blur-xl shadow-xl text-sm ",
        "text-green-200 px-2 py-2 rounded-md ",
        "before:absolute before:inset-0 before:bg-linear-to-r before:from-blue-400/30 before:to-blue-600/20 before:pointer-events-none",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span className="font-medium">{message}</span>
    </div>
  );
}