import { useEffect, useState } from "react";

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  format?: (currentValue: number) => string;
}

const AnimatedCounter = ({
  value,
  duration = 1500,
  suffix = "",
  prefix = "",
  className = "",
  format,
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frameId: number;
    let startTime: number | null = null;

    setDisplayValue(0);

    const animate = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = clamp(elapsed / duration, 0, 1);
      setDisplayValue(Math.round(progress * value));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [duration, value]);

  const renderValue = format ? format(displayValue) : displayValue.toString();

  return (
    <span className={className}>
      {prefix}
      {renderValue}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
