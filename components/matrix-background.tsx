'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { SoundEffectManager } from '@/lib/sound-effects';

interface MatrixBackgroundProps {
  isAnimationPaused: boolean;
  clickEffect?: 'explosion' | 'waterfall' | 'crack' | 'star' | 'fizzle' | 'matrix_rain' | 'glitch' | 'binary' | 'cascade' | 'square' | 'diamond' | 'cube' | 'octahedron' | 'random';
  particleSpeed?: number;
  particleCount?: number;
  particleColor?: string;
  particleLifetime?: number;
  backgroundMode?: 'matrix' | 'pulse' | 'sparkle' | 'waves' | 'grid';
  backgroundSpeed?: number;
  backgroundColor?: string;
  rippleIntensity?: number;
  rippleCharacter?: string;
  rippleParticleLimit?: number;
  rippleFadeSpeed?: number;
  rippleFadeFromCenter?: boolean;
  rippleMaxCount?: number;
  enableTrails?: boolean;
  enableMouseRipples?: boolean;
  soundEffectManager?: SoundEffectManager;
  onParticleCountChange?: (count: { total: number; particles: number; background: number; ripples: number; shapes: number }) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  life: number;
  maxLife: number;
  glow?: boolean;
  angle?: number;
  angleVelocity?: number;
  scale?: number;
}

interface Shape3DPoint {
  x: number;
  y: number;
  z: number;
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  isAnimationPaused,
  clickEffect = 'explosion', // 'random',
  particleSpeed = 1,
  particleCount = 1,
  particleColor = '#282', //  '#1DD11D',
  particleLifetime = 1,
  backgroundMode = 'matrix',
  backgroundSpeed = 1,
  backgroundColor = '#1DD11D',
  rippleIntensity = 1,
  rippleCharacter = '',
  rippleParticleLimit = 100,
  rippleFadeSpeed = 0.05,
  rippleFadeFromCenter = false,
  rippleMaxCount = 50,
  enableTrails = true,
  enableMouseRipples = true,
  soundEffectManager,
  onParticleCountChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const particlesRef = useRef<Particle[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const backgroundParticlesRef = useRef<{x: number; y: number; alpha: number; size: number; pulse?: number}[]>([]);
  const backgroundTimeRef = useRef(0);
  const shape3DRef = useRef<{points: Shape3DPoint[]; rotation: {x: number; y: number; z: number}; center: {x: number; y: number}; life?: number; maxLife?: number}[]>([]);
  const ripplesRef = useRef<{x: number; y: number; radius: number; maxRadius: number; life: number; maxLife: number}[]>([]);
  const lastMousePosRef = useRef<{x: number; y: number; time: number} | null>(null);

  // Store particle creation functions so event handlers can access them
  const particleCreatorsRef = useRef<{
    createExplosionParticles?: (x: number, y: number) => Particle[];
    createWaterfallParticles?: (x: number, y: number) => Particle[];
    createCrackParticles?: (x: number, y: number) => Particle[];
    createStarParticles?: (x: number, y: number) => Particle[];
    createFizzleParticles?: (x: number, y: number) => Particle[];
    createMatrixRainParticles?: (x: number, y: number) => Particle[];
    createGlitchParticles?: (x: number, y: number) => Particle[];
    createBinaryParticles?: (x: number, y: number) => Particle[];
    createCascadeParticles?: (x: number, y: number) => Particle[];
    createSquareParticles?: (x: number, y: number) => Particle[];
    createDiamondParticles?: (x: number, y: number) => Particle[];
    createCubeParticles?: (x: number, y: number) => Particle[];
    createOctahedronParticles?: (x: number, y: number) => Particle[];
  }>({});

  // Store current prop values in refs so event handlers always have latest values
  const propsRef = useRef({
    clickEffect,
    particleSpeed,
    particleCount,
    particleLifetime,
    particleColor,
    enableMouseRipples,
    rippleIntensity,
    rippleMaxCount,
    soundEffectManager
  });

  // Update refs when props change
  useEffect(() => {
    propsRef.current = {
      clickEffect,
      particleSpeed,
      particleCount,
      particleLifetime,
      particleColor,
      enableMouseRipples,
      rippleIntensity,
      rippleMaxCount,
      soundEffectManager
    };
  }, [clickEffect, particleSpeed, particleCount, particleLifetime, particleColor, enableMouseRipples, rippleIntensity, rippleMaxCount, soundEffectManager]);

  // Convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 34, g: 136, b: 34 };
  };

  // Separate effect for event listeners - only runs once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e: MouseEvent) => {
      // Skip if clicking on interactive elements (buttons, inputs, etc.)
      const target = e.target as HTMLElement;
      if (target && target !== canvas && target.closest('button, input, select, textarea, a, [role="button"]')) {
        return;
      }

      const x = e.clientX;
      const y = e.clientY;

      let newParticles: Particle[] = [];
      let effectToUse = propsRef.current.clickEffect;

      // Handle random effect
      if (propsRef.current.clickEffect === 'random') {
        const effects = ['explosion', 'waterfall', 'crack', 'star', 'fizzle', 'matrix_rain', 'binary', 'cascade', 'square', 'diamond', 'cube', 'octahedron'];
        effectToUse = effects[Math.floor(Math.random() * effects.length)] as any;
      }

      switch (effectToUse) {
        case 'explosion':
          newParticles = particleCreatorsRef.current.createExplosionParticles?.(x, y) || [];
          break;
        case 'waterfall':
          newParticles = particleCreatorsRef.current.createWaterfallParticles?.(x, y) || [];
          break;
        case 'crack':
          newParticles = particleCreatorsRef.current.createCrackParticles?.(x, y) || [];
          break;
        case 'star':
          newParticles = particleCreatorsRef.current.createStarParticles?.(x, y) || [];
          break;
        case 'fizzle':
          newParticles = particleCreatorsRef.current.createFizzleParticles?.(x, y) || [];
          break;
        case 'matrix_rain':
          newParticles = particleCreatorsRef.current.createMatrixRainParticles?.(x, y) || [];
          break;
        case 'glitch':
          newParticles = particleCreatorsRef.current.createGlitchParticles?.(x, y) || [];
          break;
        case 'binary':
          newParticles = particleCreatorsRef.current.createBinaryParticles?.(x, y) || [];
          break;
        case 'cascade':
          newParticles = particleCreatorsRef.current.createCascadeParticles?.(x, y) || [];
          break;
        case 'square':
          newParticles = particleCreatorsRef.current.createSquareParticles?.(x, y) || [];
          break;
        case 'diamond':
          newParticles = particleCreatorsRef.current.createDiamondParticles?.(x, y) || [];
          break;
        case 'cube':
          newParticles = particleCreatorsRef.current.createCubeParticles?.(x, y) || [];
          break;
        case 'octahedron':
          newParticles = particleCreatorsRef.current.createOctahedronParticles?.(x, y) || [];
          break;
      }

      particlesRef.current = [...particlesRef.current, ...newParticles];

      // Trigger sound effects for click
      const system = propsRef.current.soundEffectManager?.getCurrentSystem();
      if (system?.onClickEvent) {
        system.onClickEvent(x, y, effectToUse);
      }

      // Trigger sound effects for each particle created
      if (system?.onParticleCreate) {
        newParticles.forEach(p => {
          system.onParticleCreate!(p.x, p.y, p.vx, p.vy);
        });
      }
    };

    // Mouse move handler for ripples
    const handleMouseMove = (e: MouseEvent) => {
      if (!propsRef.current.enableMouseRipples || propsRef.current.rippleIntensity === 0) return;

      const x = e.clientX;
      const y = e.clientY;
      const now = Date.now();

      const throttleDistance = Math.max(10, 30 - propsRef.current.rippleIntensity * 5);
      const throttleTime = Math.max(20, 100 - propsRef.current.rippleIntensity * 20);

      if (lastMousePosRef.current) {
        const dx = x - lastMousePosRef.current.x;
        const dy = y - lastMousePosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const timeDiff = now - lastMousePosRef.current.time;

        if (distance > throttleDistance || timeDiff > throttleTime) {
          ripplesRef.current.push({
            x,
            y,
            radius: 0,
            maxRadius: 150 + propsRef.current.rippleIntensity * 50,
            life: Math.round(50 + propsRef.current.rippleIntensity * 10),
            maxLife: Math.round(50 + propsRef.current.rippleIntensity * 10)
          });
          lastMousePosRef.current = { x, y, time: now };
        }
      } else {
        lastMousePosRef.current = { x, y, time: now };
      }

      if (ripplesRef.current.length > propsRef.current.rippleMaxCount) {
        ripplesRef.current.shift();
      }
    };

    // Touch move handler for mobile ripples
    const handleTouchMove = (e: TouchEvent) => {
      if (!propsRef.current.enableMouseRipples || propsRef.current.rippleIntensity === 0) return;

      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;
      const now = Date.now();

      const throttleDistance = Math.max(10, 30 - propsRef.current.rippleIntensity * 5);
      const throttleTime = Math.max(20, 100 - propsRef.current.rippleIntensity * 20);

      if (lastMousePosRef.current) {
        const dx = x - lastMousePosRef.current.x;
        const dy = y - lastMousePosRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const timeDiff = now - lastMousePosRef.current.time;

        if (distance > throttleDistance || timeDiff > throttleTime) {
          ripplesRef.current.push({
            x,
            y,
            radius: 0,
            maxRadius: 150 + propsRef.current.rippleIntensity * 50,
            life: Math.round(50 + propsRef.current.rippleIntensity * 10),
            maxLife: Math.round(50 + propsRef.current.rippleIntensity * 10)
          });
          lastMousePosRef.current = { x, y, time: now };
        }
      } else {
        lastMousePosRef.current = { x, y, time: now };
      }

      if (ripplesRef.current.length > propsRef.current.rippleMaxCount) {
        ripplesRef.current.shift();
      }
    };

    // Storm event handler
    const handleStormEffect = (event: CustomEvent) => {
      const { x, y, effect } = event.detail

      let newParticles: Particle[] = []
      let effectToUse = effect

      if (effect === 'random') {
        const effects = ['explosion', 'waterfall', 'crack', 'star', 'fizzle', 'matrix_rain', 'binary', 'cascade', 'square', 'diamond', 'cube', 'octahedron']
        effectToUse = effects[Math.floor(Math.random() * effects.length)] as any
      }

      switch (effectToUse) {
        case 'explosion':
          newParticles = particleCreatorsRef.current.createExplosionParticles?.(x, y) || []
          break
        case 'waterfall':
          newParticles = particleCreatorsRef.current.createWaterfallParticles?.(x, y) || []
          break
        case 'crack':
          newParticles = particleCreatorsRef.current.createCrackParticles?.(x, y) || []
          break
        case 'star':
          newParticles = particleCreatorsRef.current.createStarParticles?.(x, y) || []
          break
        case 'fizzle':
          newParticles = particleCreatorsRef.current.createFizzleParticles?.(x, y) || []
          break
        case 'matrix_rain':
          newParticles = particleCreatorsRef.current.createMatrixRainParticles?.(x, y) || []
          break
        case 'glitch':
          newParticles = particleCreatorsRef.current.createGlitchParticles?.(x, y) || []
          break
        case 'binary':
          newParticles = particleCreatorsRef.current.createBinaryParticles?.(x, y) || []
          break
        case 'cascade':
          newParticles = particleCreatorsRef.current.createCascadeParticles?.(x, y) || []
          break
        case 'square':
          newParticles = particleCreatorsRef.current.createSquareParticles?.(x, y) || []
          break
        case 'diamond':
          newParticles = particleCreatorsRef.current.createDiamondParticles?.(x, y) || []
          break
        case 'cube':
          newParticles = particleCreatorsRef.current.createCubeParticles?.(x, y) || []
          break
        case 'octahedron':
          newParticles = particleCreatorsRef.current.createOctahedronParticles?.(x, y) || []
          break
      }

      particlesRef.current = [...particlesRef.current, ...newParticles]
    }

    // Attach listeners to window instead of canvas to avoid pointer-events issues
    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('storm-effect', handleStormEffect as EventListener);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('storm-effect', handleStormEffect as EventListener);
    };
  }, []); // Empty dependency array - only mount/unmount

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setupCanvas();

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    const binaryChars = '01'.split('');
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const rows = Math.floor(canvas.height / fontSize);
    const drops: number[] = [];
    const gridLetters: string[][] = []; // Store letters for all grid positions

    // Simple initialization for matrix rain
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    // Initialize grid letters for other modes
    for (let x = 0; x < columns; x++) {
      gridLetters[x] = [];
      for (let y = 0; y < rows; y++) {
        gridLetters[x][y] = letters[Math.floor(Math.random() * letters.length)];
      }
    }

    // Initialize background particles for sparkle effect
    if (backgroundParticlesRef.current.length === 0) {
      for (let i = 0; i < 100; i++) {
        backgroundParticlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          alpha: Math.random(),
          size: Math.random() * 3 + 1,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    const drawBackground = () => {
      const bgRgb = hexToRgb(backgroundColor);

      // Apply fade effect - but clear completely for waves mode or if trails disabled
      if (backgroundMode === 'waves' || !enableTrails) {
        // Clear background completely for waves to avoid trails
        ctx.fillStyle = theme === 'dark' ? 'rgb(21, 31, 55)' : 'rgb(250, 250, 245)';
      } else {
        // Use rippleFadeSpeed to control trail fade
        const fadeAlpha = Math.min(0.5, rippleFadeSpeed);
        ctx.fillStyle = theme === 'dark' ? `rgba(21, 31, 55, ${fadeAlpha})` : `rgba(250, 250, 245, ${fadeAlpha})`;
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      backgroundTimeRef.current += 0.02 * backgroundSpeed;

      // Update and draw ripples as particles
      const rgb = hexToRgb(particleColor);
      ctx.font = `${fontSize}px arial`;

      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const ripple = ripplesRef.current[i];
        ripple.life--;
        ripple.radius += 2 * rippleIntensity;

        // Use rippleParticleLimit directly to control particle count per ripple
        const particlesPerRipple = rippleParticleLimit;
        const timeAlpha = ripple.life / ripple.maxLife;

        for (let j = 0; j < particlesPerRipple; j++) {
          const angle = (Math.PI * 2 * j) / particlesPerRipple;
          const x = ripple.x + Math.cos(angle) * ripple.radius;
          const y = ripple.y + Math.sin(angle) * ripple.radius;

          // Align to grid
          const gridX = Math.round(x / fontSize) * fontSize;
          const gridY = Math.round(y / fontSize) * fontSize;

          // Calculate alpha based on settings
          let alpha = timeAlpha;
          if (rippleFadeFromCenter) {
            // Fade based on distance from center
            const distanceRatio = ripple.radius / ripple.maxRadius;
            alpha = timeAlpha * (1 - distanceRatio);
          }

          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;

          // Use custom character or random
          const char = rippleCharacter || letters[Math.floor(Math.random() * letters.length)];
          ctx.fillText(char, gridX, gridY);
        }

        if (ripple.life <= 0 || ripple.radius > ripple.maxRadius) {
          ripplesRef.current.splice(i, 1);
        }
      }
      
      switch (backgroundMode) {
        case 'matrix':
          // Original simple matrix rain
          ctx.fillStyle = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.8)`;
          ctx.font = `${fontSize}px arial`;

          for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
            }
            drops[i]++;
          }
          break;

        case 'pulse':
          // Pulsing with grid letters
          ctx.font = `${fontSize}px arial`;
          for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
              const distance = Math.sqrt(Math.pow(x - columns/2, 2) + Math.pow(y - rows/2, 2));
              const offset = Math.sin(backgroundTimeRef.current - distance * 0.1);
              if (offset > 0.7) {
                ctx.fillStyle = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${(offset - 0.7) * 1.5})`;
                ctx.fillText(gridLetters[x][y], x * fontSize, y * fontSize);
              }
            }
          }
          break;

        case 'sparkle':
          // Random particles fading in and out
          ctx.font = `${fontSize}px arial`;
          backgroundParticlesRef.current.forEach((p, idx) => {
            // Move particles slowly
            p.x += (Math.random() - 0.5) * 2 * backgroundSpeed;
            p.y += (Math.random() - 0.5) * 2 * backgroundSpeed;
            
            // Wrap around screen edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            
            // Randomly reset particles occasionally
            if (Math.random() < 0.005) {
              p.x = Math.random() * canvas.width;
              p.y = Math.random() * canvas.height;
              p.pulse = Math.random() * Math.PI * 2;
            }
            
            p.alpha = (Math.sin(backgroundTimeRef.current * 2 + p.pulse!) + 1) / 2;
            ctx.fillStyle = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${p.alpha * 0.5})`;
            const gridX = Math.floor(p.x / fontSize);
            const gridY = Math.floor(p.y / fontSize);
            if (gridX >= 0 && gridX < columns && gridY >= 0 && gridY < rows) {
              ctx.fillText(gridLetters[gridX][gridY], gridX * fontSize, gridY * fontSize);
            }
          });
          break;

        case 'waves':
          // Wave pattern with persistent letters - use backgroundColor
          ctx.font = `${fontSize}px arial`;
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
              const waveOffset = Math.sin(backgroundTimeRef.current + x * 0.2) * 2;
              const waveY = y + waveOffset;
              // Always render letters, just fade their intensity smoothly
              // Map wave offset (-2 to 2) to alpha (0.1 to 0.8)
              const normalizedOffset = Math.abs(waveOffset) / 2; // 0 to 1
              const intensity = 0.1 + (normalizedOffset * 0.7); // Never fully transparent, never fully opaque
              ctx.fillStyle = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${intensity})`;
              // Use persistent grid letters
              ctx.fillText(gridLetters[x][y], x * fontSize, waveY * fontSize);
            }
          }
          break;

        case 'grid':
          // Grid pattern with moving nodes
          ctx.font = `${fontSize}px arial`;
          for (let x = 0; x < columns; x += 3) {
            for (let y = 0; y < rows; y += 3) {
              const pulse = Math.sin(backgroundTimeRef.current * 2 + x * 0.5 + y * 0.5);
              if (pulse > 0.5) {
                ctx.fillStyle = `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, ${pulse * 0.3})`;
                ctx.fillText(gridLetters[x][y], x * fontSize, y * fontSize);
              }
            }
          }
          break;
      }
    };

    const updateParticles = () => {
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Update position
        p.x += p.vx * particleSpeed;
        p.y += p.vy * particleSpeed;
        
        // Special behaviors for different effects
        if (p.char === 'WATERFALL') {
          p.vy += 0.3 * particleSpeed;
        } else if (p.char === 'FIZZLE') {
          // Chaotic movement
          if (Math.random() < 0.1) {
            p.angle = (p.angle || 0) + (Math.random() - 0.5) * Math.PI;
            const speed = 2 + Math.random() * 2;
            p.vx = Math.cos(p.angle!) * speed;
            p.vy = Math.sin(p.angle!) * speed;
          }
          p.vx += (Math.random() - 0.5) * 0.5;
          p.vy += (Math.random() - 0.5) * 0.5;
        } else if (p.char === 'GLITCH') {
          if (Math.random() < 0.05) {
            p.x += (Math.random() - 0.5) * 50;
            p.y += (Math.random() - 0.5) * 20;
          }
        } else if (p.char === 'CASCADE') {
          p.vy += 0.2 * particleSpeed;
          if (p.y > canvas.height - 50 && p.vy > 0) {
            p.vy *= -0.5;
            p.vx *= 0.8;
          }
        }
        
        // Update life
        p.life--;

        // Remove dead particles
        if (p.life <= 0) {
          // Notify sound system
          const system = soundEffectManager?.getCurrentSystem();
          if (system?.onParticleDestroy) {
            system.onParticleDestroy(p.x, p.y);
          }
          particles.splice(i, 1);
        }
      }

      // Update 3D shapes
      shape3DRef.current.forEach(shape => {
        shape.rotation.x += 0.02 * particleSpeed;
        shape.rotation.y += 0.03 * particleSpeed;
        shape.rotation.z += 0.01 * particleSpeed;
        // Update lifetime if it exists
        if (shape.life !== undefined) {
          shape.life--;
        }
      });
    };

    const project3D = (point: Shape3DPoint, center: {x: number; y: number}, rotation: {x: number; y: number; z: number}) => {
      // Rotate around X axis
      let y = point.y * Math.cos(rotation.x) - point.z * Math.sin(rotation.x);
      let z = point.y * Math.sin(rotation.x) + point.z * Math.cos(rotation.x);
      
      // Rotate around Y axis
      let x = point.x * Math.cos(rotation.y) + z * Math.sin(rotation.y);
      z = -point.x * Math.sin(rotation.y) + z * Math.cos(rotation.y);
      
      // Rotate around Z axis
      const finalX = x * Math.cos(rotation.z) - y * Math.sin(rotation.z);
      const finalY = x * Math.sin(rotation.z) + y * Math.cos(rotation.z);
      
      // Simple perspective projection with fixed distance
      const scale = 200 / (200 + z);
      
      return {
        x: center.x + finalX * scale,
        y: center.y + finalY * scale,
        scale
      };
    };

    const drawParticles = () => {
      const particles = particlesRef.current;
      const rgb = hexToRgb(particleColor);
      ctx.font = `${fontSize}px arial`;
      
      particles.forEach(p => {
        const alpha = p.life / p.maxLife;
        
        if (p.glow) {
          ctx.shadowBlur = 10 * alpha;
          ctx.shadowColor = particleColor;
        }
        
        if (p.char === 'GLITCH' && Math.random() < 0.3) {
          ctx.save();
          ctx.globalCompositeOperation = 'difference';
        }
        
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
        
        // Always align to grid and use letters
        const x = Math.round(p.x / fontSize) * fontSize;
        const y = Math.round(p.y / fontSize) * fontSize;
        
        if (p.scale) {
          ctx.save();
          ctx.font = `${fontSize * p.scale}px arial`;
        }
        
        // Use actual letters for all effects
        const displayChar = (p.char === 'BINARY') ? binaryChars[Math.floor(Math.random() * binaryChars.length)] : 
                           (p.char.length === 1) ? p.char : 
                           letters[Math.floor(Math.random() * letters.length)];
        
        ctx.fillText(displayChar, x, y);
        
        if (p.scale) {
          ctx.restore();
        }
        
        if (p.char === 'GLITCH' && Math.random() < 0.3) {
          ctx.restore();
        }
        
        ctx.shadowBlur = 0;
      });

      // Draw 3D shapes using letter projections
      shape3DRef.current = shape3DRef.current.filter(shape => {
        // Check if shape should still exist based on lifetime
        if (shape.life !== undefined) {
          shape.life--;
          if (shape.life <= 0) return false;
        }
        
        // Draw edges by filling grid positions between points
        const projectedPoints = shape.points.map(p => project3D(p, shape.center, shape.rotation));
        
        // Calculate alpha based on lifetime
        const lifeAlpha = shape.maxLife ? shape.life! / shape.maxLife : 1;
        
        // Fill grid cells along edges (draw pairs of points as edges)
        for (let i = 0; i < projectedPoints.length; i += 2) {
          const p1 = projectedPoints[i];
          const p2 = projectedPoints[i + 1];
          
          if (!p2) continue; // Skip if no pair
          
          // Draw line between points using letters
          const steps = Math.max(Math.abs(p2.x - p1.x), Math.abs(p2.y - p1.y)) / fontSize;
          for (let t = 0; t <= steps; t += 0.5) {
            const ratio = t / steps;
            const x = p1.x + (p2.x - p1.x) * ratio;
            const y = p1.y + (p2.y - p1.y) * ratio;
            const gridX = Math.round(x / fontSize) * fontSize;
            const gridY = Math.round(y / fontSize) * fontSize;
            
            const alpha = Math.max(0.3, Math.min(p1.scale, p2.scale)) * lifeAlpha;
            ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
            ctx.fillText(letters[Math.floor(Math.random() * letters.length)], gridX, gridY);
          }
        }
        
        return true;
      });
    };

    const createExplosionParticles = (x: number, y: number) => {
      const count = Math.round(20 * particleCount);
      const particles: Particle[] = [];
      const baseLife = Math.round(30 * particleLifetime);
      
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 3 + Math.random() * 3;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          char: letters[Math.floor(Math.random() * letters.length)],
          life: baseLife,
          maxLife: baseLife
        });
      }
      
      return particles;
    };

    const createWaterfallParticles = (x: number, y: number) => {
      const particles: Particle[] = [];
      const baseLife = Math.round(80 * particleLifetime);
      
      // Create structured waterfall covering area below click
      const width = 200;
      const particlesPerRow = Math.round(width / fontSize);
      const rowCount = Math.round(15 * particleCount);
      
      for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < particlesPerRow; col++) {
          const xPos = x - width/2 + col * fontSize;
          const delay = row * 2;
          particles.push({
            x: xPos,
            y: y + delay,
            vx: 0,
            vy: 2 + Math.random(),
            char: 'WATERFALL',
            life: baseLife - delay,
            maxLife: baseLife,
            glow: Math.random() < 0.1
          });
        }
      }
      
      return particles;
    };

    const createSquareParticles = (x: number, y: number) => {
      const particles: Particle[] = [];
      const baseLife = Math.round(40 * particleLifetime);
      const size = 100; // Bigger for letter grid
      const particlesPerSide = Math.round(12 * particleCount);
      
      for (let i = 0; i < particlesPerSide * 4; i++) {
        const side = Math.floor(i / particlesPerSide);
        const t = (i % particlesPerSide) / particlesPerSide;
        
        let px, py, vx, vy;
        
        switch(side) {
          case 0: // top
            px = x - size + t * size * 2;
            py = y - size;
            vx = 0;
            vy = -2;
            break;
          case 1: // right
            px = x + size;
            py = y - size + t * size * 2;
            vx = 2;
            vy = 0;
            break;
          case 2: // bottom
            px = x + size - t * size * 2;
            py = y + size;
            vx = 0;
            vy = 2;
            break;
          case 3: // left
            px = x - size;
            py = y + size - t * size * 2;
            vx = -2;
            vy = 0;
            break;
        }
        
        particles.push({
          x: px!,
          y: py!,
          vx: vx!,
          vy: vy!,
          char: letters[Math.floor(Math.random() * letters.length)],
          life: baseLife,
          maxLife: baseLife
        });
      }
      
      return particles;
    };

    const createDiamondParticles = (x: number, y: number) => {
      const particles: Particle[] = [];
      const baseLife = Math.round(40 * particleLifetime);
      const size = 80;
      const particlesPerSide = Math.round(10 * particleCount);
      
      for (let i = 0; i < particlesPerSide * 4; i++) {
        const side = Math.floor(i / particlesPerSide);
        const t = (i % particlesPerSide) / particlesPerSide;
        
        let px, py, vx, vy;
        
        switch(side) {
          case 0: // top-right
            px = x + t * size;
            py = y - t * size;
            vx = 1.4;
            vy = -1.4;
            break;
          case 1: // right-bottom
            px = x + size - t * size;
            py = y - size + t * size * 2;
            vx = 1.4;
            vy = 1.4;
            break;
          case 2: // bottom-left
            px = x + size - t * size * 2;
            py = y + size - t * size;
            vx = -1.4;
            vy = 1.4;
            break;
          case 3: // left-top
            px = x - size + t * size;
            py = y + size - t * size * 2;
            vx = -1.4;
            vy = -1.4;
            break;
        }
        
        particles.push({
          x: px!,
          y: py!,
          vx: vx!,
          vy: vy!,
          char: letters[Math.floor(Math.random() * letters.length)],
          life: baseLife,
          maxLife: baseLife,
          glow: true
        });
      }
      
      return particles;
    };

    const createCubeParticles = (x: number, y: number) => {
      const size = 60; // Smaller size
      const baseLife = Math.round(50 * particleLifetime); // Add lifetime control
      
      // Define cube vertices at fixed Z distance
      const vertices: Shape3DPoint[] = [
        {x: -size, y: -size, z: 100 - size},
        {x: size, y: -size, z: 100 - size},
        {x: size, y: size, z: 100 - size},
        {x: -size, y: size, z: 100 - size},
        {x: -size, y: -size, z: 100 + size},
        {x: size, y: -size, z: 100 + size},
        {x: size, y: size, z: 100 + size},
        {x: -size, y: size, z: 100 + size},
      ];
      
      // Store edges as point pairs with lifetime
      const edges = [
        vertices[0], vertices[1], vertices[1], vertices[2], vertices[2], vertices[3], vertices[3], vertices[0], // front
        vertices[4], vertices[5], vertices[5], vertices[6], vertices[6], vertices[7], vertices[7], vertices[4], // back
        vertices[0], vertices[4], vertices[1], vertices[5], vertices[2], vertices[6], vertices[3], vertices[7]  // connections
      ];
      
      shape3DRef.current.push({
        points: edges,
        rotation: {x: 0, y: 0, z: 0},
        center: {x, y},
        life: baseLife,
        maxLife: baseLife
      });
      
      return [];
    };

    const createOctahedronParticles = (x: number, y: number) => {
      const size = 60; // Smaller size
      const baseLife = Math.round(50 * particleLifetime); // Add lifetime control
      
      // Define octahedron vertices at fixed Z distance
      const vertices: Shape3DPoint[] = [
        {x: 0, y: -size, z: 100}, // top - fixed Z distance
        {x: size, y: 0, z: 100},  // right
        {x: 0, y: 0, z: 100 + size},  // front
        {x: -size, y: 0, z: 100}, // left
        {x: 0, y: 0, z: 100 - size}, // back
        {x: 0, y: size, z: 100},  // bottom - fixed Z distance
      ];
      
      // Define edges as pairs
      const edges = [];
      // Top pyramid edges
      edges.push(vertices[0], vertices[1]);
      edges.push(vertices[0], vertices[2]);
      edges.push(vertices[0], vertices[3]);
      edges.push(vertices[0], vertices[4]);
      // Bottom pyramid edges
      edges.push(vertices[5], vertices[1]);
      edges.push(vertices[5], vertices[2]);
      edges.push(vertices[5], vertices[3]);
      edges.push(vertices[5], vertices[4]);
      // Middle square edges
      edges.push(vertices[1], vertices[2]);
      edges.push(vertices[2], vertices[3]);
      edges.push(vertices[3], vertices[4]);
      edges.push(vertices[4], vertices[1]);
      
      shape3DRef.current.push({
        points: edges,
        rotation: {x: 0, y: 0, z: 0},
        center: {x, y},
        life: baseLife,
        maxLife: baseLife
      });
      
      return [];
    };

    const createCrackParticles = (x: number, y: number) => {
      const count = Math.round(12 * particleCount);
      const particles: Particle[] = [];
      const baseLife = Math.round(40 * particleLifetime);
      
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const distance = 20 + Math.random() * 20;
        particles.push({
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          vx: 0,
          vy: 0,
          char: letters[Math.floor(Math.random() * letters.length)],
          life: baseLife,
          maxLife: baseLife,
          glow: true
        });
      }
      
      return particles;
    };

    const createStarParticles = (x: number, y: number) => {
      const count = Math.round(8 * particleCount);
      const particles: Particle[] = [];
      const baseLife = Math.round(50 * particleLifetime);
      
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          char: letters[Math.floor(Math.random() * letters.length)],
          life: baseLife,
          maxLife: baseLife
        });
      }
      
      return particles;
    };

    const createFizzleParticles = (x: number, y: number) => {
      const count = Math.round(25 * particleCount);
      const particles: Particle[] = [];
      const baseLife = Math.round(60 * particleLifetime);
      
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        const life = Math.round((30 + Math.random() * 30) * particleLifetime);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          char: 'FIZZLE',
          life: life,
          maxLife: baseLife,
          angle: angle
        });
      }
      
      return particles;
    };

    const createMatrixRainParticles = (x: number, y: number) => {
      const count = Math.round(30 * particleCount);
      const particles: Particle[] = [];
      const baseLife = Math.round(80 * particleLifetime);
      
      for (let i = 0; i < count; i++) {
        const column = Math.floor((x + (Math.random() - 0.5) * 100) / fontSize) * fontSize;
        const life = Math.round((40 + Math.random() * 40) * particleLifetime);
        particles.push({
          x: column,
          y: y - Math.random() * 100,
          vx: 0,
          vy: 2 + Math.random() * 2,
          char: letters[Math.floor(Math.random() * letters.length)],
          life: life,
          maxLife: baseLife,
          glow: Math.random() < 0.3
        });
      }
      
      return particles;
    };

    const createGlitchParticles = (x: number, y: number) => {
      const count = Math.round(20 * particleCount);
      const particles: Particle[] = [];
      const baseLife = Math.round(40 * particleLifetime);
      
      for (let i = 0; i < count; i++) {
        const life = Math.round((10 + Math.random() * 30) * particleLifetime);
        particles.push({
          x: x + (Math.random() - 0.5) * 100,
          y: y + (Math.random() - 0.5) * 50,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          char: 'GLITCH',
          life: life,
          maxLife: baseLife,
          scale: 0.5 + Math.random() * 1.5
        });
      }
      
      return particles;
    };

    const createBinaryParticles = (x: number, y: number) => {
      const count = Math.round(40 * particleCount);
      const particles: Particle[] = [];
      const baseLife = Math.round(60 * particleLifetime);
      
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 4;
        const life = Math.round((30 + Math.random() * 30) * particleLifetime);
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          char: 'BINARY',
          life: life,
          maxLife: baseLife
        });
      }
      
      return particles;
    };

    const createCascadeParticles = (x: number, y: number) => {
      const count = Math.round(20 * particleCount);
      const particles: Particle[] = [];
      const baseLife = Math.round(80 * particleLifetime);
      
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 50,
          y: y - Math.random() * 30,
          vx: (Math.random() - 0.5) * 3,
          vy: -5 - Math.random() * 5,
          char: 'CASCADE',
          life: baseLife,
          maxLife: baseLife
        });
      }
      
      return particles;
    };

    // Store all particle creator functions in ref for event handlers to access
    particleCreatorsRef.current = {
      createExplosionParticles,
      createWaterfallParticles,
      createCrackParticles,
      createStarParticles,
      createFizzleParticles,
      createMatrixRainParticles,
      createGlitchParticles,
      createBinaryParticles,
      createCascadeParticles,
      createSquareParticles,
      createDiamondParticles,
      createCubeParticles,
      createOctahedronParticles
    };

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Animation function
    const draw = () => {
      if (!isAnimationPaused) {
        drawBackground();
      }
      updateParticles();
      drawParticles();

      // Report particle counts
      if (onParticleCountChange) {
        const particleCount = particlesRef.current.length;
        const backgroundCount = backgroundParticlesRef.current.length;
        // Each ripple creates rippleParticleLimit visual particles
        const rippleParticleCount = ripplesRef.current.length * rippleParticleLimit;
        const shapeCount = shape3DRef.current.length;
        const total = particleCount + backgroundCount + rippleParticleCount + shapeCount;

        onParticleCountChange({
          total,
          particles: particleCount,
          background: backgroundCount,
          ripples: rippleParticleCount,
          shapes: shapeCount
        });

        // Update sound system with total count
        const system = soundEffectManager?.getCurrentSystem();
        if (system?.onParticleCountUpdate) {
          system.onParticleCountUpdate(total);
        }
      }
    };

    // Start animation with interval like original
    intervalRef.current = setInterval(draw, 33);

    // Handle window resize
    const handleResize = () => {
      setupCanvas();
      // Reinitialize background particles for new size
      backgroundParticlesRef.current = [];
      for (let i = 0; i < 100; i++) {
        backgroundParticlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          alpha: Math.random(),
          size: Math.random() * 3 + 1,
          pulse: Math.random() * Math.PI * 2
        });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, isAnimationPaused, clickEffect, particleSpeed, particleCount, particleColor, particleLifetime, backgroundMode, backgroundSpeed, backgroundColor, rippleIntensity, rippleCharacter, rippleParticleLimit, rippleFadeSpeed, rippleFadeFromCenter, rippleMaxCount, enableTrails, enableMouseRipples]); // Add all dependencies

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />;
};

export default MatrixBackground;