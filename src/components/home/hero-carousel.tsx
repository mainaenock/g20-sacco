"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Calculator, ChevronLeft, ChevronRight, FileCheck2, Pause, Play, ShieldCheck } from "lucide-react";
import type { HeroSlide } from "@/content/home-hero";
import { ButtonLink, Container } from "@/components/ui/primitives";

type HeroCarouselProps = {
  slides: HeroSlide[];
};

const AUTOPLAY_DELAY = 7000;
const SWIPE_THRESHOLD = 45;

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const activeSlide = slides[activeIndex];

  useEffect(() => {
    const reducedMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || slides.length < 2 || reducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (!activeSlide) return null;

  function selectSlide(index: number) {
    setActiveIndex((index + slides.length) % slides.length);
    setPaused(true);
  }

  function finishSwipe(clientX: number) {
    if (touchStart.current === null) return;
    const distance = clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    selectSlide(activeIndex + (distance < 0 ? 1 : -1));
  }

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Great 20 Sacco highlights">
      <Container className="hero__grid">
        <div className="hero__copy">
          <div className="hero__copy-panel" key={activeSlide.id}>
            <p className="eyebrow">{activeSlide.eyebrow}</p>
            <h1>{activeSlide.title} <span>{activeSlide.emphasis}</span></h1>
            <p className="hero__lead">{activeSlide.description}</p>
            <div className="hero__actions">
              <ButtonLink href={activeSlide.primaryAction.href}>{activeSlide.primaryAction.label}</ButtonLink>
              <ButtonLink href={activeSlide.secondaryAction.href} variant="secondary">{activeSlide.secondaryAction.label}</ButtonLink>
            </div>
          </div>

          <div className="hero__trust">
            <span><ShieldCheck size={18} /> No PINs or OTPs requested</span>
            <span><Calculator size={18} /> Deterministic estimates</span>
            <span><FileCheck2 size={18} /> Application, not instant approval</span>
          </div>
        </div>

        <div
          className="hero__visual"
          onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => finishSwipe(event.changedTouches[0]?.clientX ?? 0)}
        >
          <div className="hero__media-stack">
            {slides.map((slide, index) => (
              <figure
                className={`hero__media${index === activeIndex ? " is-active" : ""}`}
                aria-hidden={index !== activeIndex}
                key={slide.id}
              >
                <Image
                  className="hero__image"
                  src={slide.image}
                  alt={index === activeIndex ? slide.imageAlt : ""}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 799px) calc(100vw - 32px), (max-width: 1200px) 40vw, 560px"
                />
                <figcaption>{slide.imageLabel}</figcaption>
              </figure>
            ))}
          </div>

          <div className="hero__slider-controls">
            <button type="button" onClick={() => selectSlide(activeIndex - 1)} aria-label="Show previous hero slide"><ChevronLeft /></button>
            <div className="hero__dots" aria-label="Choose a hero slide">
              {slides.map((slide, index) => (
                <button
                  type="button"
                  className={index === activeIndex ? "is-active" : ""}
                  onClick={() => selectSlide(index)}
                  aria-label={`Show slide ${index + 1}: ${slide.title} ${slide.emphasis}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  key={slide.id}
                />
              ))}
            </div>
            <button type="button" onClick={() => selectSlide(activeIndex + 1)} aria-label="Show next hero slide"><ChevronRight /></button>
            <button type="button" onClick={() => setPaused((current) => !current)} aria-label={paused ? "Resume hero slides" : "Pause hero slides"}>
              {paused ? <Play /> : <Pause />}
            </button>
          </div>
          <p className="sr-only" aria-live="polite">Slide {activeIndex + 1} of {slides.length}: {activeSlide.title} {activeSlide.emphasis}</p>
        </div>
      </Container>
    </section>
  );
}
