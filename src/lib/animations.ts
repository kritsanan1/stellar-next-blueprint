import gsap from 'gsap';

// GSAP Animation Utilities for Fuel Station System

export const gsapAnimations = {
  // Page transition animations
  slideUp: (element: HTMLElement | string, delay: number = 0) => {
    return gsap.fromTo(element, 
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay, ease: "power2.out" }
    );
  },

  fadeInScale: (element: HTMLElement | string, delay: number = 0) => {
    return gsap.fromTo(element,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, delay, ease: "back.out(1.7)" }
    );
  },

  // Button hover effects
  buttonHover: (element: HTMLElement) => {
    const tl = gsap.timeline({ paused: true });
    tl.to(element, { scale: 1.05, duration: 0.2, ease: "power2.out" })
      .to(element, { boxShadow: "0 8px 25px rgba(0,0,0,0.15)", duration: 0.2 }, 0);
    return tl;
  },

  buttonLeave: (element: HTMLElement) => {
    return gsap.to(element, { 
      scale: 1, 
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)", 
      duration: 0.2, 
      ease: "power2.out" 
    });
  },

  // QR Code animations
  qrCodeReveal: (element: HTMLElement | string) => {
    return gsap.fromTo(element,
      { scale: 0, rotation: -10, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }
    );
  },

  qrCodePulse: (element: HTMLElement | string) => {
    return gsap.to(element, {
      scale: 1.05,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
  },

  // Status indicator animations
  pulseGlow: (element: HTMLElement | string) => {
    return gsap.to(element, {
      boxShadow: "0 0 20px rgba(34, 197, 94, 0.6)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });
  },

  successBounce: (element: HTMLElement | string) => {
    return gsap.fromTo(element,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "bounce.out" }
    );
  },

  // Loading animations
  spinLoader: (element: HTMLElement | string) => {
    return gsap.to(element, {
      rotation: 360,
      duration: 1,
      repeat: -1,
      ease: "none"
    });
  },

  // Card entrance animations
  staggerCards: (elements: HTMLElement[] | string) => {
    return gsap.fromTo(elements,
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.5, 
        stagger: 0.1, 
        ease: "power2.out" 
      }
    );
  },

  // Amount selection animations
  amountSelect: (element: HTMLElement) => {
    const tl = gsap.timeline();
    tl.to(element, { scale: 0.95, duration: 0.1 })
      .to(element, { scale: 1.02, duration: 0.15 })
      .to(element, { scale: 1, duration: 0.1 });
    return tl;
  },

  // Fuel type selection animations
  fuelTypeSelect: (element: HTMLElement) => {
    return gsap.fromTo(element,
      { scale: 1, borderColor: "transparent" },
      { 
        scale: 1.02, 
        borderColor: "hsl(var(--primary))",
        duration: 0.3,
        ease: "power2.out"
      }
    );
  },

  // Page transitions
  pageTransition: {
    enter: (element: HTMLElement | string) => {
      return gsap.fromTo(element,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    },
    
    exit: (element: HTMLElement | string) => {
      return gsap.to(element, {
        x: -100,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in"
      });
    }
  }
};

// Utility functions
export const initializeGSAP = () => {
  // Set default GSAP settings
  gsap.defaults({
    duration: 0.3,
    ease: "power2.out"
  });
};

export const cleanupGSAP = (element: HTMLElement | string) => {
  gsap.killTweensOf(element);
};