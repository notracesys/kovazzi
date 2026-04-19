'use client';

import React, { useState, useEffect } from 'react';

const NUM_PARTICLES = 100;

export default function ParticleBackground() {
  const [particles, setParticles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: NUM_PARTICLES }).map(() => ({
      position: 'absolute',
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      width: `${Math.random() * 4 + 2}px`,
      height: `${Math.random() * 4 + 2}px`,
      backgroundColor: 'rgba(255, 204, 0, 0.3)', // Amarelo dourado suave
      borderRadius: '50%',
      animation: `rise ${Math.random() * 2 + 3}s linear infinite`,
      animationDelay: `-${Math.random() * 5}s`,
    }));
    setParticles(newParticles as React.CSSProperties[]);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-background">
        {particles.map((style, index) => (
          <div key={index} style={style} />
        ))}
    </div>
  );
}
