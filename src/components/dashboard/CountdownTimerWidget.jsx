import React, { useState, useEffect, useRef } from 'react';
import { BellRing } from 'lucide-react';

export default function CountdownTimerWidget() {
  const [hours, setHours] = useState(5);
  const [minutes, setMinutes] = useState(9);
  const [seconds, setSeconds] = useState(0);

  // Initialize with exactly 05:08:56 (18536 seconds) out of 05:09:00 (18540 seconds)
  const [totalSeconds, setTotalSeconds] = useState(18536);
  const [initialSeconds, setInitialSeconds] = useState(18540);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const intervalRef = useRef(null);

  // Sound play helper on completion
  const playTimerChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.0);
    } catch (e) {
      console.warn("Audio Context blocked:", e);
    }
  };

  // Adjust timers up/down
  const adjustUnit = (unit, amount) => {
    if (isRunning) return;
    setIsFinished(false);

    if (unit === 'h') {
      setHours((prev) => {
        const next = Math.max(0, Math.min(23, prev + amount));
        setTotalSeconds(next * 3600 + minutes * 60 + seconds);
        setInitialSeconds(next * 3600 + minutes * 60 + seconds);
        return next;
      });
    } else if (unit === 'm') {
      setMinutes((prev) => {
        let next = prev + amount;
        if (next > 59) next = 0;
        if (next < 0) next = 59;
        setTotalSeconds(hours * 3600 + next * 60 + seconds);
        setInitialSeconds(hours * 3600 + next * 60 + seconds);
        return next;
      });
    } else if (unit === 's') {
      setSeconds((prev) => {
        let next = prev + amount;
        if (next > 59) next = 0;
        if (next < 0) next = 59;
        setTotalSeconds(hours * 3600 + minutes * 60 + next);
        setInitialSeconds(hours * 3600 + minutes * 60 + next);
        return next;
      });
    }
  };

  // Main countdown timer interval loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            playTimerChime();
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    if (totalSeconds <= 0) return;
    setIsFinished(false);
    setIsRunning(!isRunning);
  };

  // Convert seconds remaining to display
  const dispHours = Math.floor(totalSeconds / 3600);
  const dispMinutes = Math.floor((totalSeconds % 3600) / 60);
  const dispSeconds = totalSeconds % 60;

  const formatNum = (num) => String(num).padStart(2, '0');

  // SVG Progress circle values
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = initialSeconds > 0 ? totalSeconds / initialSeconds : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="bg-[#1E223F] text-white rounded-[30px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 shadow-2xl select-none w-full border border-white/5">
      
      {/* LEFT: SVG Countdown Ring Progress Column */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-40 h-40 md:w-44 md:h-44 flex items-center justify-center bg-[#151838] rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.3)]">
          {/* Animated SVG Ring */}
          <svg className="w-full h-full transform -rotate-90 select-none">
            {/* Background ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="stroke-[#191C3E]"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Foreground progress ring */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              className="transition-all duration-1000 ease-linear stroke-[#FF5C5C]"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Core Numerical Time Display */}
          <div className="absolute flex flex-col items-center">
            {isFinished ? (
              <div className="flex flex-col items-center animate-bounce text-[#FF5C5C]">
                <BellRing size={26} />
                <span className="text-[11px] font-black tracking-widest uppercase mt-1">Done</span>
              </div>
            ) : (
              <span className="text-[26px] md:text-[30px] font-sans font-normal tracking-tight text-white tabular-nums">
                {formatNum(dispHours)}:{formatNum(dispMinutes)}:{formatNum(dispSeconds)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Time Setter Adjustment Controls & Buttons */}
      <div className="flex-1 flex flex-col justify-between w-full h-full">
        {/* Unit Controllers - Hours, Minutes, Seconds dials perfectly matching Figma via CSS Grid */}
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center text-center max-w-[280px] md:max-w-[320px] mx-auto md:mx-0 mb-6 gap-y-1 select-none">
          {/* Row 1: Labels */}
          <div className="text-[12px] md:text-[14px] font-sans text-[#787B95] tracking-wide font-normal">Hours</div>
          <div />
          <div className="text-[12px] md:text-[14px] font-sans text-[#787B95] tracking-wide font-normal">Minutes</div>
          <div />
          <div className="text-[12px] md:text-[14px] font-sans text-[#787B95] tracking-wide font-normal">Seconds</div>

          {/* Row 2: Up Buttons */}
          <div className="flex justify-center">
            <button
              onClick={() => adjustUnit('h', 1)}
              disabled={isRunning}
              className="text-[#787B95] hover:text-white disabled:opacity-30 disabled:pointer-events-none p-1 transition-all cursor-pointer"
            >
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0L15.7942 9.75H0.205771L8 0Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div />
          <div className="flex justify-center">
            <button
              onClick={() => adjustUnit('m', 1)}
              disabled={isRunning}
              className="text-[#787B95] hover:text-white disabled:opacity-30 disabled:pointer-events-none p-1 transition-all cursor-pointer"
            >
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0L15.7942 9.75H0.205771L8 0Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div />
          <div className="flex justify-center">
            <button
              onClick={() => adjustUnit('s', 1)}
              disabled={isRunning}
              className="text-[#787B95] hover:text-white disabled:opacity-30 disabled:pointer-events-none p-1 transition-all cursor-pointer"
            >
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0L15.7942 9.75H0.205771L8 0Z" fill="currentColor"/>
              </svg>
            </button>
          </div>

          {/* Row 3: Values & Colons */}
          <div className="text-3xl md:text-[40px] font-sans font-light text-white leading-none tracking-tight tabular-nums select-none py-1">
            {formatNum(hours)}
          </div>
          <div className="text-[#787B95] text-2xl md:text-3xl font-light select-none leading-none pb-1 px-1">
            :
          </div>
          <div className="text-3xl md:text-[40px] font-sans font-light text-white leading-none tracking-tight tabular-nums select-none py-1">
            {formatNum(minutes)}
          </div>
          <div className="text-[#787B95] text-2xl md:text-3xl font-light select-none leading-none pb-1 px-1">
            :
          </div>
          <div className="text-3xl md:text-[40px] font-sans font-light text-white leading-none tracking-tight tabular-nums select-none py-1">
            {formatNum(seconds)}
          </div>

          {/* Row 4: Down Buttons */}
          <div className="flex justify-center">
            <button
              onClick={() => adjustUnit('h', -1)}
              disabled={isRunning}
              className="text-[#787B95] hover:text-white disabled:opacity-30 disabled:pointer-events-none p-1 transition-all cursor-pointer"
            >
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 10L0.205771 0.25H15.7942L8 10Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div />
          <div className="flex justify-center">
            <button
              onClick={() => adjustUnit('m', -1)}
              disabled={isRunning}
              className="text-[#787B95] hover:text-white disabled:opacity-30 disabled:pointer-events-none p-1 transition-all cursor-pointer"
            >
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 10L0.205771 0.25H15.7942L8 10Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          <div />
          <div className="flex justify-center">
            <button
              onClick={() => adjustUnit('s', -1)}
              disabled={isRunning}
              className="text-[#787B95] hover:text-white disabled:opacity-30 disabled:pointer-events-none p-1 transition-all cursor-pointer"
            >
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 10L0.205771 0.25H15.7942L8 10Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Action Button Strip - Spanning full width of right side */}
        <button
          onClick={handleStartPause}
          disabled={totalSeconds <= 0}
          className="w-full bg-[#FF6464] hover:bg-[#ff5252] active:scale-[0.98] text-white text-base md:text-lg font-sans font-medium py-3 px-6 rounded-[30px] shadow-lg shadow-red-950/20 select-none transition-all cursor-pointer mt-2"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  );
}
