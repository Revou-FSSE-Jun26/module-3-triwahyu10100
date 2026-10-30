import type { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const MAX_WIDTH = {
  sm: "max-w-container-sm",
  md: "max-w-container-md",
  lg: "max-w-container-lg",
} as const;

export function Container({
  children,
  size = "md",
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${MAX_WIDTH[size]} ${className}`}>
      {children}
    </div>
  );
}
