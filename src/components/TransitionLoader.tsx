import { useEffect, useState } from 'react';

interface TransitionLoaderProps {
  onLoadingComplete: () => void;
}

export const TransitionLoader = ({ onLoadingComplete }: TransitionLoaderProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000; // 3 seconds
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      
      if (elapsed < duration) {
        // Rotate counter-clockwise (negative degrees)
        setRotation(-((elapsed / duration) * 360));
        requestAnimationFrame(animate);
      } else {
        onLoadingComplete();
      }
    };

    requestAnimationFrame(animate);

    return () => {
      // Cleanup if component unmounts
      setRotation(0);
    };
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative w-40 h-40">
        {/* Tick marks container */}
        <div className="absolute inset-0">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-2 bg-primary/70 origin-bottom"
              style={{
                left: '50%',
                bottom: '50%',
                transform: `rotate(${i * 15}deg) translateY(-90%)`,
              }}
            />
          ))}
        </div>
        
        {/* Rotating semicircle */}
        <div
          className="absolute inset-0 origin-center transition-transform duration-100 ease-linear"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-full h-full">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full transform -rotate-90"
            >
              <path
                d="M 50,50 m 0,-47 a 47,47 0 1 1 0,94 a 47,47 0 1 1 0,-94"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-primary"
                strokeDasharray="147.65, 295.31" // This creates the semi-circle effect
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
