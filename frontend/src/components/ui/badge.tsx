// /frontend/src/components/ui/badge.tsx
import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// Importa a lógica de variantes do arquivo separado
import { badgeVariants } from "./badgeVariants";

// Define as props, herdando todas as props de um <div> HTML
// e as nossas variantes
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge };
