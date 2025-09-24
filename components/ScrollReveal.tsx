"use client";

import { type ComponentPropsWithoutRef, type ElementType, type Ref, useEffect, useRef } from "react";
import { UI_FLAGS } from "@/src/ui/ui.flags";

type PolymorphicProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
  once?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function ScrollReveal<T extends ElementType = "div">({
  as,
  className,
  children,
  once = true,
  ...rest
}: PolymorphicProps<T>) {
  const Component = (as ?? "div") as ElementType;
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!UI_FLAGS.scrollReveal) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    if (window.innerWidth < 768) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const element = elementRef.current;
    if (!element) {
      return;
    }

    element.classList.add("scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-reveal--visible");
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove("scroll-reveal--visible");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once]);

  return (
    <Component ref={elementRef as unknown as Ref<any>} className={className} {...rest}>
      {children}
    </Component>
  );
}
