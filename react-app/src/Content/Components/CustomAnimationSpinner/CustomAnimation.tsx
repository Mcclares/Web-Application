import React, { useEffect, useState } from 'react';
import './CustomAnimation.css';

interface CustomAnimationProps {
  spriteSheet: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  frameDuration: number;
}

const CustomAnimation: React.FC<CustomAnimationProps> = ({ spriteSheet, frameWidth, frameHeight, frameCount, frameDuration }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % frameCount);
      setProgress((prevProgress) => (prevProgress + 10) % 101); // Примерное увеличение на 10% каждый цикл
    }, frameDuration);

    return () => clearInterval(interval);
  }, [frameCount, frameDuration]);

  return (
    <div className="animation-container">
      <div
        className="sprite"
        style={{
          width: frameWidth,
          height: frameHeight,
          backgroundImage: `url(${spriteSheet})`,
          backgroundPosition: `-${currentFrame * frameWidth}px 0px`,
        }}
      ></div>
    </div>
  );
};

export default CustomAnimation;