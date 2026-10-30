"use client";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
}

export function FadeInSection({ children, className = "" }: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-in-up ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
