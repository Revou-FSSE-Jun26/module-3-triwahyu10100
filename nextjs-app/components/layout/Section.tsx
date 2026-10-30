import type { ReactNode } from "react";
import { Container } from "./Container";

export interface SectionProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  tone?: "default" | "ink";
  className?: string;
  as?: "section" | "div";
}

export function Section({
  children,
  size = "md",
  tone = "default",
  className = "",
  as = "section",
}: SectionProps) {
  const Tag = as;
  return (
    <Tag
      className={`py-12 sm:py-16 ${tone === "ink" ? "band-ink" : ""} ${className}`}>
      <Container size={size}>{children}</Container>
    </Tag>
  );
}
