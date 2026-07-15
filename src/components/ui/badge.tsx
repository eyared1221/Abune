"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        warning: "bg-[#fff4d7] text-[#f59e0b]",
        success: "bg-[#e9f9ef] text-[#2e9c62]",
        info: "bg-[#e8f0ff] text-[#4676ff]",
        danger: "bg-[#ffe8ef] text-[#ef476f]",
        violet: "bg-[#f2eaff] text-[#8b5cf6]",
        neutral: "bg-[#f1f4fb] text-[#73809f]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
