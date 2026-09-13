'use client';

import React, { useEffect, useRef } from 'react';

export default function CyberMatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Characters: Tech symbols, code tokens, binary, hex
    const chars = '01<>/{}[]=+-*&|^~LEVELONE⚡CONSOLE.LOG';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array(columns).fill(1).map(() => Math.floor(Math.random() * -100));

    let frameCount = 0;

    const render = () => {
      frameCount++;
      // Render every 2 frames for smooth retro 30fps cyber feel and ultra-low CPU usage
      if (frameCount % 2 === 0) {
        // Semi-transparent fade for cyber trail
        ctx.fillStyle = 'rgba(5, 5, 7, 0.15)';
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < drops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Glowing tip effect
          ctx.font = `${fontSize}px monospace`;
          if (Math.random() > 0.95) {
            ctx.fillStyle = '#60a5fa'; // Bright cyan-blue spark
            ctx.shadowColor = '#3b82f6';
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = 'rgba(59, 130, 246, 0.18)'; // Subtle matrix blue stream
            ctx.shadowBlur = 0;
          }

          ctx.fillText(char, x, y);

          if (y > height && Math.random() > 0.985) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {/* Dynamic Canvas */}
      <canvas ref={canvasRef} className="opacity-45 block w-full h-full" />
      
      {/* Ambient Grid overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" 
      />

      {/* Radial Vignette to keep content readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050507]/80 via-transparent to-[#050507]/80" />
    </div>
  );
}
