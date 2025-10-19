import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';

// Deterministic pseudo-random number generator
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

// Character pool for scrambling
const GLYPH_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export const useDecodeText = ({
  lines = [],
  open = false,
  openDuration = 1400,
  closeDuration = 800,
  lineStagger = 100,
  charStagger = 12,
  onClosed = null
}) => {
  const [phase, setPhase] = useState('idle');
  const [decodedLines, setDecodedLines] = useState([]);
  const animationStartTime = useRef(0);
  const frameId = useRef(null);
  const hasInitialized = useRef(false);

  // Initialize decoded lines with blank spaces
  useEffect(() => {
    if (lines.length > 0 && !hasInitialized.current) {
      setDecodedLines(lines.map(line => ({
        original: line,
        current: line.split('').map(() => ' ').join(''),
        progress: 0
      })));
      hasInitialized.current = true;
      
      // Start decoding animation if open
      if (open) {
        setPhase('decoding');
        animationStartTime.current = performance.now();
      }
    }
  }, [lines, open]);

  // Handle phase changes
  useEffect(() => {
    if (open && (phase === 'idle' || phase === 'encoded')) {
      setPhase('decoding');
      animationStartTime.current = performance.now();
    } else if (!open && phase === 'decoded') {
      setPhase('encoding');
      animationStartTime.current = performance.now();
    }
  }, [open, phase]);

  // Animation loop
  useFrame(() => {
    const now = performance.now();
    const elapsed = now - animationStartTime.current;

    if (phase === 'decoding') {
      const duration = openDuration;
      const globalProgress = Math.min(elapsed / duration, 1);

      setDecodedLines(prevLines => 
        prevLines.map((lineData, lineIndex) => {
          const lineDelay = lineIndex * lineStagger;
          const lineProgress = Math.max(0, Math.min((elapsed - lineDelay) / duration, 1));

          if (lineProgress === 0) {
            return lineData;
          }

          const chars = lineData.original.split('');
          const newChars = chars.map((char, charIndex) => {
            if (char === ' ') return ' ';

            const charDelay = lineDelay + charIndex * charStagger;
            const charProgress = Math.max(0, Math.min((elapsed - charDelay) / duration, 1));

            if (charProgress >= 1) {
              return char;
            }

            if (charProgress === 0) {
              return ' ';
            }

            // Scramble effect
            const rng = new SeededRandom(lineIndex * 1000 + charIndex + Math.floor(elapsed / 50));
            const randomChar = GLYPH_POOL[Math.floor(rng.next() * GLYPH_POOL.length)];
            
            // Gradually reveal the correct character
            if (rng.next() < charProgress * 0.7) {
              return char;
            }

            return randomChar;
          });

          return {
            ...lineData,
            current: newChars.join(''),
            progress: lineProgress
          };
        })
      );

      if (globalProgress >= 1) {
        setPhase('decoded');
        // Ensure final characters are correct
        setDecodedLines(prevLines => 
          prevLines.map(lineData => ({
            ...lineData,
            current: lineData.original,
            progress: 1
          }))
        );
      }
    } else if (phase === 'encoding') {
      const duration = closeDuration;
      const globalProgress = Math.min(elapsed / duration, 1);

      setDecodedLines(prevLines => 
        prevLines.map((lineData, lineIndex) => {
          const lineDelay = lineIndex * (lineStagger * 0.5);
          const lineProgress = Math.max(0, Math.min((elapsed - lineDelay) / duration, 1));

          const chars = lineData.original.split('');
          const newChars = chars.map((char, charIndex) => {
            if (char === ' ') return ' ';

            const charDelay = lineDelay + charIndex * (charStagger * 0.5);
            const charProgress = Math.max(0, Math.min((elapsed - charDelay) / duration, 1));

            if (charProgress >= 1) {
              return ' ';
            }

            // Scramble effect (reverse)
            const rng = new SeededRandom(lineIndex * 1000 + charIndex + Math.floor(elapsed / 50));
            const randomChar = GLYPH_POOL[Math.floor(rng.next() * GLYPH_POOL.length)];
            
            // Gradually scramble the character
            if (rng.next() < (1 - charProgress) * 0.7) {
              return char;
            }

            return randomChar;
          });

          return {
            ...lineData,
            current: newChars.join(''),
            progress: 1 - lineProgress
          };
        })
      );

      if (globalProgress >= 1) {
        setPhase('idle');
        if (onClosed) {
          onClosed();
        }
      }
    }
  });

  // Pause on tab blur
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause animation
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return {
    decodedLines,
    phase,
    isAnimating: phase === 'decoding' || phase === 'encoding'
  };
};
