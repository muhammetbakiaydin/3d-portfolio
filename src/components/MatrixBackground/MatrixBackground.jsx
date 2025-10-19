import { useRef, useEffect } from 'react';
import './MatrixBackground.scss';

export function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Matrix characters - Katakana, Latin, numbers
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const charArray = chars.split('');

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Array of drops - one per column
    const drops = Array(columns).fill(1);
    
    // Random starting positions
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Drawing the characters
    function draw() {
      // Black background with low opacity for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      // Loop through drops
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Calculate position
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Color gradient - brighter at the head
        const progress = (y % canvas.height) / canvas.height;
        const greenIntensity = Math.floor(255 * (1 - progress * 0.5));
        ctx.fillStyle = `rgb(0, ${greenIntensity}, 0)`;
        
        // Draw character
        ctx.fillText(char, x, y);

        // Reset drop randomly after it crosses the screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Increment Y coordinate
        drops[i]++;
      }
    }

    // Animation loop
    const interval = setInterval(draw, 33); // ~30fps

    // Handle resize
    const handleResize = () => {
      setCanvasSize();
      const newColumns = Math.floor(canvas.width / fontSize);
      drops.length = newColumns;
      for (let i = 0; i < newColumns; i++) {
        if (drops[i] === undefined) {
          drops[i] = Math.random() * -100;
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-background" />;
}

export default MatrixBackground;
