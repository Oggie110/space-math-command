import { useEffect, useRef } from 'react';

export const StarField = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const starCount = 100;
    const stars: HTMLDivElement[] = [];

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${Math.random() * 2 + 2}s`;
      
      canvasRef.current.appendChild(star);
      stars.push(star);
    }

    return () => {
      stars.forEach(star => star.remove());
    };
  }, []);

  return <div ref={canvasRef} className="star-field" />;
};
