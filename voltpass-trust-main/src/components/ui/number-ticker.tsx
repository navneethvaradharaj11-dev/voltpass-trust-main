import { useEffect, useRef } from "react";

export function NumberTicker({ value, duration = 1500 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const startValue = parseInt(ref.current?.textContent || "0", 10) || 0;
    const distance = value - startValue;

    if (distance === 0) {
      if (ref.current) ref.current.textContent = value.toString();
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      if (progress < duration) {
        const percentage = progress / duration;
        // ease-out-quad
        const easeOut = 1 - (1 - percentage) * (1 - percentage);
        const currentCount = Math.round(startValue + easeOut * distance);
        
        if (ref.current) ref.current.textContent = currentCount.toString();
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (ref.current) ref.current.textContent = value.toString();
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span ref={ref}>0</span>;
}
