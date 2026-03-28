'use client';

import type { RunnerState } from '@/components/interactives/algo-visualizer/hooks/useRunner';
import type { AlgorithmViewType } from '@/components/interactives/algo-visualizer/lib/types';

interface ControlPanelProps {
  runner: RunnerState<unknown>;
  viewType: AlgorithmViewType;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  onNewInput: () => void;
}

export function ControlPanel({ runner, viewType, arraySize, onArraySizeChange, onNewInput }: ControlPanelProps) {
  const { currentStep, totalSteps, isPlaying, isDone, speed } = runner;
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="shrink-0 border-t border-neutral-200 bg-[#faf8f4]">
      {/* Progress bar */}
      <div className="h-1 bg-neutral-200">
        <div
          className="h-full bg-blue-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-4 py-3 flex items-center gap-4 flex-wrap">
        {/* Step counter */}
        <span className="text-xs font-mono text-neutral-400 shrink-0 w-20">
          {currentStep + 1} / {totalSteps}
        </span>

        {/* Transport controls */}
        <div className="flex items-center gap-1">
          <IconBtn onClick={runner.jumpToStart} title="Jump to start" disabled={currentStep === 0}>
            <SkipBackIcon />
          </IconBtn>
          <IconBtn onClick={runner.stepBack} title="Step back" disabled={currentStep === 0}>
            <StepBackIcon />
          </IconBtn>

          <button
            onClick={isPlaying ? runner.pause : runner.play}
            disabled={isDone && !isPlaying}
            title={isPlaying ? 'Pause' : 'Play'}
            className={`flex items-center justify-center w-9 h-9 rounded-md border transition-colors duration-100 font-medium text-sm
              ${isPlaying
                ? 'bg-red-500 border-red-400 text-white hover:bg-red-600'
                : 'bg-blue-500 border-blue-400 text-white hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <IconBtn onClick={runner.stepForward} title="Step forward" disabled={isDone}>
            <StepForwardIcon />
          </IconBtn>
          <IconBtn onClick={runner.jumpToEnd} title="Jump to end" disabled={isDone}>
            <SkipForwardIcon />
          </IconBtn>
        </div>

        {/* Reset */}
        <button
          onClick={runner.reset}
          title="Reset"
          className="px-3 h-8 rounded-md border border-neutral-200 text-xs text-neutral-500 hover:text-neutral-900 hover:border-blue-300 transition-colors duration-100"
        >
          Reset
        </button>

        {/* Speed slider */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-neutral-400">Speed</span>
          <input
            type="range"
            min={50} max={1000} step={50}
            value={1050 - speed}
            onChange={e => runner.setSpeed(1050 - Number(e.target.value))}
            className="w-24 accent-blue-500 cursor-pointer"
          />
          <span className="text-xs font-mono text-neutral-400 w-14">
            {speed < 100 ? `${speed}ms` : `${(speed / 1000).toFixed(1)}s`}/step
          </span>
        </div>

        {/* Array controls (sorting only) */}
        {viewType === 'array' && (
          <>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-neutral-400">Size</span>
              <input
                type="range"
                min={8} max={28} step={1}
                value={arraySize}
                onChange={e => onArraySizeChange(Number(e.target.value))}
                className="w-20 accent-blue-500 cursor-pointer"
              />
              <span className="text-xs font-mono text-neutral-400 w-4">{arraySize}</span>
            </div>
            <button
              onClick={onNewInput}
              className="px-3 h-8 rounded-md border border-neutral-200 text-xs text-neutral-500 hover:text-green-600 hover:border-green-300 transition-colors duration-100 shrink-0"
            >
              New Array
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function IconBtn({ onClick, title, disabled, children }: {
  onClick: () => void; title: string; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center justify-center w-8 h-8 rounded-md border border-neutral-200 text-neutral-500
        hover:text-neutral-900 hover:border-blue-300 transition-colors duration-100
        disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

const iconProps = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'currentColor' };

function PlayIcon() {
  return <svg {...iconProps}><polygon points="5,3 19,12 5,21" /></svg>;
}
function PauseIcon() {
  return <svg {...iconProps}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
}
function StepBackIcon() {
  return <svg {...iconProps}><polygon points="15,5 5,12 15,19"/><rect x="17" y="5" width="2" height="14"/></svg>;
}
function StepForwardIcon() {
  return <svg {...iconProps}><polygon points="9,5 19,12 9,19"/><rect x="5" y="5" width="2" height="14"/></svg>;
}
function SkipBackIcon() {
  return <svg {...iconProps}><polygon points="19,5 9,12 19,19"/><polygon points="11,5 1,12 11,19"/></svg>;
}
function SkipForwardIcon() {
  return <svg {...iconProps}><polygon points="5,5 15,12 5,19"/><polygon points="13,5 23,12 13,19"/></svg>;
}
