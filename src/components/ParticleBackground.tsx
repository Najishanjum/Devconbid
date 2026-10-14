import React, { useEffect, useRef } from 'react';

interface Particle {
  // Base anchor and trajectory
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  
  // Motion parameters
  phaseX: number;
  phaseY: number;
  speedX: number;
  speedY: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  depth: number; // 0.4 to 1.2 for depth perception & parallax
  
  // Visuals
  type: 'dot' | 'dash' | 'ring';
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  vRot: number;
}

// Sophisticated Google Antigravity gradient palette
const PARTICLE_PALETTE = [
  '#2563EB', // Electric Blue
  '#3B82F6', // Sky Blue
  '#4F46E5', // Indigo
  '#7C3AED', // Vivid Violet
  '#8B5CF6', // Purple
  '#EC4899', // Magenta
  '#F43F5E', // Rose Coral
  '#F97316', // Warm Coral
  '#F59E0B', // Amber Gold
];

export const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse state with smooth velocity
    const mouse = {
      x: -2000,
      y: -2000,
      targetX: -2000,
      targetY: -2000,
      vx: 0,
      vy: 0,
      active: false,
      lastMoveTime: 0,
    };

    // Calculate count based on screen width
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 85 : 190;

    // Initialize particles
    const particles: Particle[] = [];

    const createParticle = (): Particle => {
      // Semi-radial organic dispersion centered slightly toward hero center
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.7) * (Math.max(width, height) * 0.65);
      const centerX = width * 0.5;
      const centerY = height * 0.42;

      const baseX = Math.min(Math.max(centerX + Math.cos(angle) * radius, 10), width - 10);
      const baseY = Math.min(Math.max(centerY + Math.sin(angle) * radius, 10), height - 10);

      // Randomize shape type
      const randType = Math.random();
      const type: 'dot' | 'dash' | 'ring' = randType < 0.6 ? 'dot' : randType < 0.88 ? 'dash' : 'ring';

      const color = PARTICLE_PALETTE[Math.floor(Math.random() * PARTICLE_PALETTE.length)];
      const depth = 0.4 + Math.random() * 0.8;
      const size = type === 'dash' ? 7 + Math.random() * 8 : 1.8 + Math.random() * 2.8;

      return {
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        vx: 0,
        vy: 0,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: (0.003 + Math.random() * 0.006) * (Math.random() > 0.5 ? 1 : -1),
        speedY: (0.003 + Math.random() * 0.006) * (Math.random() > 0.5 ? 1 : -1),
        orbitRadiusX: 18 + Math.random() * 32,
        orbitRadiusY: 14 + Math.random() * 26,
        depth,
        type,
        size,
        color,
        alpha: 0.35 + Math.random() * 0.55,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
      };
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    // High DPI Canvas Scaling
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.resetTransform?.();
      ctx.scale(dpr, dpr);

      // Re-anchor particles gently to new viewport dimensions
      particles.forEach((p) => {
        if (p.baseX > width) p.baseX = Math.random() * width;
        if (p.baseY > height) p.baseY = Math.random() * height;
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse movement with smooth damping
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      mouse.vx = currentX - mouse.targetX;
      mouse.vy = currentY - mouse.targetY;
      mouse.targetX = currentX;
      mouse.targetY = currentY;
      mouse.active = true;
      mouse.lastMoveTime = performance.now();
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    // Passive touch handler for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = touch.clientX - rect.left;
        mouse.targetY = touch.clientY - rect.top;
        mouse.active = true;
        mouse.lastMoveTime = performance.now();
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
      mouse.targetX = -2000;
      mouse.targetY = -2000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Physics Animation Loop
    let time = 0;
    const render = () => {
      time += 1;

      // Smooth mouse cursor lag for buttery fluid interaction
      mouse.x += (mouse.targetX - mouse.x) * 0.15;
      mouse.y += (mouse.targetY - mouse.y) * 0.15;

      // Fade out mouse activity after inactivity
      if (performance.now() - mouse.lastMoveTime > 3000) {
        mouse.active = false;
      }

      ctx.clearRect(0, 0, width, height);

      // Repulsion configuration
      const repelRadius = isMobile ? 110 : 155;
      const repelForce = isMobile ? 3.5 : 5.2;

      // Parallax center offset
      const parallaxFactorX = ((mouse.x - width / 2) / (width / 2)) * 12;
      const parallaxFactorY = ((mouse.y - height / 2) / (height / 2)) * 12;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // 1. Natural organic harmonic oscillation around anchor
          p.phaseX += p.speedX;
          p.phaseY += p.speedY;

          const targetDriftX =
            p.baseX +
            Math.sin(p.phaseX) * p.orbitRadiusX +
            (mouse.active ? parallaxFactorX * p.depth : 0);
          const targetDriftY =
            p.baseY +
            Math.cos(p.phaseY) * p.orbitRadiusY +
            (mouse.active ? parallaxFactorY * p.depth : 0);

          // 2. Mouse magnetic repulsion & ripple physics
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < repelRadius && dist > 0) {
              // Non-linear gentle falloff curve
              const normDist = 1 - dist / repelRadius;
              const force = Math.pow(normDist, 1.4) * repelForce;

              // Tangent swirl effect (fluid deflection)
              const nx = dx / dist;
              const ny = dy / dist;
              const perpX = -ny * 0.35;
              const perpY = nx * 0.35;

              p.vx += (nx + perpX) * force;
              p.vy += (ny + perpY) * force;
            }
          }

          // 3. Elastic restoring force towards harmonic drift target
          const spring = 0.04;
          const damping = 0.88;

          p.vx += (targetDriftX - p.x) * spring;
          p.vy += (targetDriftY - p.y) * spring;

          p.vx *= damping;
          p.vy *= damping;

          p.x += p.vx;
          p.y += p.vy;

          // Rotation
          p.rotation += p.vRot + (Math.abs(p.vx) + Math.abs(p.vy)) * 0.01;
        }

        // Draw Particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'dot') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else if (p.type === 'dash') {
          // Rounded pill / stroke
          const halfLen = p.size * 0.5;
          const thickness = 2.4;
          ctx.beginPath();
          ctx.lineCap = 'round';
          ctx.lineWidth = thickness;
          ctx.strokeStyle = p.color;
          ctx.moveTo(-halfLen, 0);
          ctx.lineTo(halfLen, 0);
          ctx.stroke();
        } else if (p.type === 'ring') {
          // Hollow micro ring
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = p.color;
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
