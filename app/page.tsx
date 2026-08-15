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
import { computeStoreStatus } from '@/lib/storeStatus';
import { StoreStatus } from '@/lib/types';

export default function Home() {
  const [isHeroPassed, setIsHeroPassed] = useState<boolean>(false);
  const [threadProgress, setThreadProgress] = useState<number>(0);
  const [storeStatus] = useState<StoreStatus>(computeStoreStatus());
  const occTempRef = useRef<number>(0.7);
  const timeWarmRef = useRef<number>(0);

  useEffect(() => {
    // Determine ambient time warmth (evening / night warmth)
    const h = new Date().getHours();
    timeWarmRef.current = h >= 17 || h < 7 ? 0.12 : 0;

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.082,
      wheelMultiplier: 0.9,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const gsapTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(0);

    // Dynamic temperature applicator
    const applyTemperature = () => {
      const handEl = document.getElementById('the-hand');
      const warmEl = document.getElementById('warm-room');
      const closeEl = document.getElementById('fitting-room');

      const handY = handEl ? handEl.getBoundingClientRect().top + window.scrollY : null;
      const warmY = warmEl ? warmEl.getBoundingClientRect().top + window.scrollY : null;
      const closeY = closeEl ? closeEl.getBoundingClientRect().top + window.scrollY : null;

      const vh = window.innerHeight;
      const mid = window.scrollY + vh * 0.5;
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

      const mix = (a: number[], b: number[]) =>
        a.map((v, i) => Math.round(v + (b[i] - v) * t));

      const bg = mix([11, 15, 24], [23, 20, 18]);
      const panel = mix([19, 27, 41], [40, 33, 28]);
      const grade = mix([18, 42, 74], [92, 54, 26]);

      const root = document.documentElement;
      root.style.setProperty('--warm', t.toFixed(3));
      root.style.setProperty('--room-bg', `rgb(${bg.join(',')})`);
      root.style.setProperty('--room-panel', `rgb(${panel.join(',')})`);
      root.style.setProperty(
        '--grade',
        `rgba(${grade.join(',')}, ${(0.16 + t * 0.06).toFixed(2)})`
      );
    };

    const onScroll = () => {
      const thresholdEl = document.getElementById('threshold');
      const meaningEl = document.getElementById('meaning');
      const vh = window.innerHeight;

      if (thresholdEl && meaningEl) {
        const heroEnd = thresholdEl.offsetTop + thresholdEl.offsetHeight;
        const totalHeight = document.documentElement.scrollHeight - vh;
        
        // Only start threadline once Beat 3 "Book a fitting" button is scrolled and hero completes
        const hasPassedHero = window.scrollY >= heroEnd - 10;
        setIsHeroPassed(hasPassedHero);

        if (hasPassedHero) {
          const remainingSpan = Math.max(1, totalHeight - heroEnd);
          const relativeScroll = Math.max(0, window.scrollY - heroEnd);
          const tProg = Math.min(1, Math.max(0, relativeScroll / remainingSpan));
          setThreadProgress(tProg);
        } else {
          setThreadProgress(0);
        }
      }

      applyTemperature();
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Staggered reveals via GSAP
    const revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 34, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
          },
        }
      );
    });

    const headingElements = document.querySelectorAll('main section:not(#threshold) h2');
    headingElements.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 1.25,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
          },
        }
      );
    });

    // Image depth scrubbing
    const scrubImages = document.querySelectorAll(
      '#blue-room figure img, #the-hand figure img, #diaries figure img'
    );
    scrubImages.forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 1.12 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.7,
          },
        }
      );
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      gsap.ticker.remove(gsapTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleOccasionChange = (id: string) => {
    occTempRef.current = { haldi: 1, sangeet: 0.82, wedding: 0.7, reception: 0.42 }[id] || 0.7;
  };

  return (
    <div
      style={{
        position: 'relative',
        background: 'var(--room-bg)',
        color: 'var(--room-fg)',
        fontFamily: 'var(--font-inter-tight), -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '17px',
        lineHeight: 1.65,
        letterSpacing: '0.005em',
        overflowX: 'clip',
        transition: 'background 600ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <Header />
      <TheThread visible={isHeroPassed} scrollProgress={threadProgress} />

      <main>
        <HeroThreshold storeStatus={storeStatus} />
        <TheNameMeaning />
        <BlueRoom />
        <TheRail />
        <TheHandLoupe />
        <WarmRoomWedding onOccasionChange={handleOccasionChange} />
        <TheFitting />
        <ClientDiaries />
        <FittingRoomCard />
      </main>

      <Footer />
    </div>
  );
}
