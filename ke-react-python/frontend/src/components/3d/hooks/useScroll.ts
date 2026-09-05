"use client";

import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: 'main',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return progress;
}

export function useElementScrollProgress(selector: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: selector,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
    });

    return () => ctx.revert();
  }, [selector]);

  return progress;
}

export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: 'main',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          setOffset(self.progress * speed * 100);
        },
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return offset;
}