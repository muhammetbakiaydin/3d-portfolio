import { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useDecodeText } from './useDecodeText';
import './DecodingTextTerminal.scss';

// Text Display Component (inside Canvas)
function DecodingText({ lines, open, openDuration, closeDuration, lineStagger, charStagger, onAnimationComplete }) {
  const { decodedLines } = useDecodeText({
    lines,
    open,
    openDuration,
    closeDuration,
    lineStagger,
    charStagger,
    onClosed: onAnimationComplete
  });

  const { viewport } = useThree();
  const fontSize = Math.min(viewport.width / 40, 0.12);
  const lineHeight = fontSize * 1.5;
  const totalHeight = decodedLines.length * lineHeight;
  const startY = totalHeight / 2 - lineHeight / 2;

  return (
    <group>
      {decodedLines.map((lineData, index) => {
        // Calculate color based on progress: green (decoded) -> white (final)
        const progress = lineData.progress || 0;
        const greenAmount = Math.max(0, 1 - progress); // 1 -> 0
        const color = `rgb(${Math.floor(232 * (1 - greenAmount * 0.5))}, ${Math.floor(232 + greenAmount * 23)}, ${Math.floor(232 * (1 - greenAmount * 0.5))})`;
        
        return (
          <Text
            key={index}
            position={[0, startY - index * lineHeight, 0]}
            fontSize={fontSize}
            color={color}
            anchorX="center"
            anchorY="top"
            fontFamily="monospace"
            outlineWidth={0}
            outlineColor="#000000"
          >
            {lineData.current}
          </Text>
        );
      })}
    </group>
  );
}

// Main DecodingTextTerminal Component
export function DecodingTextTerminal({
  lines = [
    'SYSTEM INITIALIZED',
    'LOADING DEVELOPMENT PORTFOLIO...',
    '',
    'Full-stack developer specializing in',
    'React, Three.js, and modern web technologies.',
    '',
    'Creating immersive digital experiences',
    'that push the boundaries of the web.',
  ],
  open = false,
  onClosed = null,
  openDuration = 1400,
  closeDuration = 800,
  lineStagger = 100,
  charStagger = 12
}) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(open);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [internalOpen, setInternalOpen] = useState(open);

  // Handle visibility changes
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setAnimatingOut(false);
      setInternalOpen(true);
    }
  }, [open]);

  // Handle animation complete (after encoding finishes)
  const handleAnimationComplete = () => {
    setIsVisible(false);
    setAnimatingOut(false);
    setInternalOpen(false);
    if (onClosed) {
      onClosed();
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && internalOpen) {
        e.preventDefault();
        setInternalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [internalOpen]);

  // Calculate animation styles
  const getAnimationStyle = () => {
    if (!isVisible) {
      return {
        opacity: 0,
        transform: 'translateY(24px) scale(0.98)',
        pointerEvents: 'none'
      };
    } else if (!open && animatingOut) {
      return {
        opacity: 0,
        transform: 'translateY(24px) scale(0.98)',
        pointerEvents: 'none',
        transition: 'opacity 0.6s cubic-bezier(0.32, 0, 0.67, 0), transform 0.6s cubic-bezier(0.32, 0, 0.67, 0)'
      };
    } else {
      return {
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        pointerEvents: 'auto',
        transition: 'opacity 0.6s cubic-bezier(0.33, 1, 0.68, 1), transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)'
      };
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      e.preventDefault();
      e.stopPropagation();
      setInternalOpen(false);
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInternalOpen(false);
  };

  if (!isVisible && !animatingOut) {
    return null;
  }

  return (
    <div 
      className="decoding-terminal-backdrop"
      onClick={handleBackdropClick}
      style={getAnimationStyle()}
    >
      <div className="decoding-terminal-container" ref={containerRef}>
        {/* Terminal Chrome */}
        <div className="decoding-terminal-header">
          <div className="terminal-traffic-lights">
            <button 
              className="traffic-light close"
              onClick={handleCloseClick}
              aria-label="Close"
            />
            <button className="traffic-light minimize" aria-label="Minimize" />
            <button className="traffic-light maximize" aria-label="Maximize" />
          </div>
          <div className="terminal-title">Terminal</div>
        </div>

        {/* Canvas */}
        <div className="decoding-terminal-canvas">
          <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 1000 }}
            gl={{ 
              antialias: true,
              alpha: false
            }}
          >
            <color attach="background" args={['#0c0c0c']} />
            <DecodingText
              lines={lines}
              open={internalOpen}
              openDuration={openDuration}
              closeDuration={closeDuration}
              lineStagger={lineStagger}
              charStagger={charStagger}
              onAnimationComplete={handleAnimationComplete}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

export default DecodingTextTerminal;
