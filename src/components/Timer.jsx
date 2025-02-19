import React, { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

export function Timer({ duration, onTimeUp, isActive }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp, isActive]);

  return (
    <div className="flex items-center gap-2 text-lg font-semibold">
      <TimerIcon className="w-6 h-6" />
      <span className={timeLeft <= 5 ? 'text-red-500' : ''}>
        {timeLeft}s
      </span>
    </div>
  );
}