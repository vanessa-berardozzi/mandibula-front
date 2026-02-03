// components/ui/Banner.tsx
import { cn } from "@/lib/utils"; // utilitaire shadcn pour fusionner les classes

export function Banner({ message, className }: { message: string; className?: string }) {

  {/* Todo  1 { Ajouter une animation de glissement ou de fondu pour l'apparition/disparition du banner  */}
  return (
    <div
      className={cn(
        "relative flex items-center backdrop-blur-sm text-sm ",
        "text-lime-200 px-2 py-2 rounded-sm ",
        "before:absolute before:inset-0 before:bg-linear-to-r before:from-blue-400/30 before:to-blue-600/20 ",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <span className="font-medium">{message}</span>
    </div>
  );
}
