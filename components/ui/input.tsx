import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Style inspiré du champ navbar
        "bg-teal-200/20 border border-border text-foreground placeholder-muted focus:outline-none focus:border-primary transition px-4 py-2 rounded-md w-full min-w-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }

