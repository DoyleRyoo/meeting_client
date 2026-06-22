import { useEffect, useRef, useState } from "react";

export function Waveform({ active }: { active: boolean }) {
  const [bars, setBars] = useState<number[]>(Array(48).fill(12));
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setBars(
        Array(48)
          .fill(0)
          .map((_, index) => 8 + Math.sin(index * 0.5) * 6),
      );
      return;
    }

    const animate = () => {
      timeRef.current += 0.09;
      setBars(
        Array(48)
          .fill(0)
          .map((_, index) => {
            const base = Math.sin(timeRef.current + index * 0.35) * 0.5 + 0.5;
            const noise = Math.random() * 0.25;
            return Math.max(4, Math.round((base + noise) * 72));
          }),
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [active]);

  return (
    <div className="flex h-28 items-center justify-center gap-[3px]">
      {bars.map((height, index) => (
        <div
          key={index}
          className="w-[5px] rounded-full transition-none"
          style={{
            height: `${height}px`,
            backgroundColor: active ? "#111111" : "#CCCCCC",
            opacity: active ? 0.75 + (height / 72) * 0.25 : 0.5,
          }}
        />
      ))}
    </div>
  );
}
