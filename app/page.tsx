'use client';

import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TheThread from '@/components/common/TheThread';

import HeroThreshold from '@/components/sections/HeroThreshold';
import TheNameMeaning from '@/components/sections/TheNameMeaning';
import BlueRoom from '@/components/sections/BlueRoom';
import TheRail from '@/components/sections/TheRail';
import TheHandLoupe from '@/components/sections/TheHandLoupe';
import WarmRoomWedding from '@/components/sections/WarmRoomWedding';
import TheFitting from '@/components/sections/TheFitting';
import ClientDiaries from '@/components/sections/ClientDiaries';
import FittingRoomCard from '@/components/sections/FittingRoomCard';
import VolumetricAtelierStudio from '@/components/sections/VolumetricAtelierStudio';
import { computeStoreStatus } from '@/lib/storeStatus';
import { StoreStatus } from '@/lib/types';

export default function Home() {
  const [isHeroPassed, setIsHeroPassed] = useState<boolean>(false);
  const [threadProgress, setThreadProgress] = useState<number>(0);
  const [storeStatus] = useState<StoreStatus>(computeStoreStatus());
  const occTempRef = useRef<number>(0.7);
  const timeWarmRef = useRef<number>(0);
  const lastTRef = useRef<number>(-1);

  // Cached layout coordinates to avoid synchronous layout reflows on scroll
  const layoutCacheRef = useRef<{
    triggerY: number;
    totalSpan: number;
    handY: number | null;
    warmY: number | null;
    closeY: number | null;
  }>({
    triggerY: 0,
    totalSpan: 1,
    handY: null,
    warmY: null,
    closeY: null,
  });

  useEffect(() => {
    // Determine ambient time warmth (evening / night warmth)
    const h = new Date().getHours();
    timeWarmRef.current = h >= 17 || h < 7 ? 0.12 : 0;

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis butter-smooth 60/120 FPS scroll
    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      infinite: false,
    });

    const gsapTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(0);

    // Measure layout once and on resize
    const updateLayoutCache = () => {
      const vh = window.innerHeight;
      const thresholdEl = document.getElementById('threshold');
      const meaningEl = document.getElementById('meaning');
      const handEl = document.getElementById('the-hand');
      const warmEl = document.getElementById('warm-room');
      const closeEl = document.getElementById('fitting-room');

      let trigY = 0;
      if (thresholdEl) {
        const span = Math.max(1, thresholdEl.offsetHeight - vh);
        trigY = thresholdEl.offsetTop + span * 0.8;
      } else if (meaningEl) {
        trigY = meaningEl.offsetTop;
      }

      const totalHeight = document.documentElement.scrollHeight - vh;
      const totalSpan = Math.max(1, totalHeight - trigY);

      layoutCacheRef.current = {
        triggerY: trigY,
        totalSpan,
        handY: handEl ? handEl.offsetTop : null,
        warmY: warmEl ? warmEl.offsetTop : null,
        closeY: closeEl ? closeEl.offsetTop : null,
      };
    };

    updateLayoutCache();
    window.addEventListener('resize', updateLayoutCache, { passive: true });

    // Dynamic temperature applicator (cached without layout thrashing)
    const applyTemperature = (currentScrollY: number) => {
      const { handY, warmY, closeY } = layoutCacheRef.current;
      const vh = window.innerHeight;
      const mid = currentScrollY + vh * 0.5;
      let w = 0;

      if (handY != null && warmY != null) {
        w = Math.min(1, Math.max(0, (mid - handY) / Math.max(1, warmY + vh * 0.4 - handY)));
        if (closeY != null && mid > closeY - vh * 0.2) {
          const back = Math.min(1, (mid - (closeY - vh * 0.2)) / (vh * 0.9));
          w = w * (1 - back) + 0.5 * back;
        }
      }

      w = Math.min(1, w + timeWarmRef.current * 0.3);
      const occ = occTempRef.current ?? 0.7;
      const t = Math.min(1, w * (0.72 + occ * 0.38));

      // Skip DOM styling if value hasn't shifted significantly
      if (Math.abs(lastTRef.current - t) < 0.015) return;
      lastTRef.current = t;

      const mix = (a: number[], b: number[]) =>
        a.map((v, i) => Math.round(v + (b[i] - v) * t));

      const bg = mix([11, 15, 24], [23, 20, 18]);
      const panel = mix([19, 27, 41], [40, 33, 28]);
      const grade = mix([18, 42, 74], [92, 54, 26]);

      const root = document.documentElement;
      root.style.setProperty('--warm', t.toFixed(2));
      root.style.setProperty('--room-bg', `rgb(${bg.join(',')})`);
      root.style.setProperty('--room-panel', `rgb(${panel.join(',')})`);
      root.style.setProperty(
        '--grade',
        `rgba(${grade.join(',')}, ${(0.16 + t * 0.06).toFixed(2)})`
      );
    };

    let ticking = false;
    lenis.on('scroll', (e: { scroll: number }) => {
      ScrollTrigger.update();

      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = e.scroll;
          const { triggerY, totalSpan } = layoutCacheRef.current;

          const hasPassedHero = scrollY >= triggerY;
          setIsHeroPassed((prev) => (prev !== hasPassedHero ? hasPassedHero : prev));

          if (hasPassedHero) {
            const relativeScroll = Math.max(0, scrollY - triggerY);
            const tProg = Math.min(1, Math.max(0, relativeScroll / totalSpan));
            setThreadProgress((prev) => (Math.abs(prev - tProg) > 0.005 ? tProg : prev));
          } else {
            setThreadProgress((prev) => (prev !== 0 ? 0 : prev));
          }

          applyTemperature(scrollY);
          ticking = false;
        });
        ticking = true;
      }
    });

    // Staggered reveals via GSAP
    const revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 28, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      gsap.ticker.remove(gsapTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener('resize', updateLayoutCache);
    };
  }, []);

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: 'var(--room-bg)',
        color: 'var(--room-fg)',
        overflowX: 'clip',
      }}
    >
      <Header />

      {/* Hero: 1080p Canvas Threshold & ReactBits Silk Shader */}
      <HeroThreshold storeStatus={storeStatus} />

      {/* The Story & Meaning Behind THARO */}
      <TheNameMeaning />

      {/* The Bespoke Indigo Blue Room */}
      <BlueRoom />

      {/* The Bespoke Rail Collection */}
      <TheRail />

      {/* The 42-Point Hand Measurement Loupe */}
      <TheHandLoupe />

      {/* Imperial Wedding Warm Room */}
      <WarmRoomWedding />

      {/* 3D Master Fitting Room Card Deck */}
      <TheFitting />

      {/* Volumetric 3D Atelier Spatial Canvas */}
      <VolumetricAtelierStudio />

      {/* Client Fitting Diaries & Testimonials */}
      <ClientDiaries />

      {/* Private Appointment Card */}
      <FittingRoomCard />

      {/* Persistent Gold Thread of Passage (Chapter Navigator) */}
      <TheThread visible={isHeroPassed} scrollProgress={threadProgress} />

      <Footer />
    </main>
  );
}
