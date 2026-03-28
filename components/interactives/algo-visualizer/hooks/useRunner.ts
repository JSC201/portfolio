'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Step } from '@/components/interactives/algo-visualizer/lib/types';

export interface RunnerState<S> {
  step: Step<S> | null;
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  isDone: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  stepForward: () => void;
  stepBack: () => void;
  jumpToStart: () => void;
  jumpToEnd: () => void;
  reset: () => void;
  setSpeed: (ms: number) => void;
}

export function useRunner<S>(steps: Step<S>[]): RunnerState<S> {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(400);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset to step 0 whenever the steps array reference changes
  // (algorithm switch or new input — steps is memoized in the parent)
  useEffect(() => {
    setCurrent(0);
    setIsPlaying(false);
  }, [steps]);

  // Playback loop
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!isPlaying) return;
    if (current >= steps.length - 1) { setIsPlaying(false); return; }

    timerRef.current = setTimeout(() => {
      setCurrent(c => c + 1);
    }, speed);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, current, speed, steps.length]);

  const reset = useCallback(() => {
    setCurrent(0);
    setIsPlaying(false);
  }, []);

  const safeIdx = Math.min(current, steps.length - 1);

  return {
    step:         steps[safeIdx] ?? null,
    currentStep:  safeIdx,
    totalSteps:   steps.length,
    isPlaying,
    isDone:       safeIdx >= steps.length - 1,
    speed,
    play:         () => setIsPlaying(true),
    pause:        () => setIsPlaying(false),
    stepForward:  () => { setIsPlaying(false); setCurrent(c => Math.min(c + 1, steps.length - 1)); },
    stepBack:     () => { setIsPlaying(false); setCurrent(c => Math.max(c - 1, 0)); },
    jumpToStart:  () => { setIsPlaying(false); setCurrent(0); },
    jumpToEnd:    () => { setIsPlaying(false); setCurrent(steps.length - 1); },
    reset,
    setSpeed,
  };
}
