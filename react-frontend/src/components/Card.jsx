import React from "react";
import { cn } from "../lib/utils";

const Card = ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl bg-card text-card-foreground shadow",
      className,
    )}
    {...props}
  />
);
Card.displayName = "Card";

const CardContent = ({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  />
);
CardContent.displayName = "CardContent";

export { Card, CardContent };
