"use client";

import { useRef } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  realtimeMode: boolean;
  onRealtimeToggle: (v: boolean) => void;
  onCount: () => void;
  onReset: () => void;
};

export default function TextArea({
  value,
  onChange,
  realtimeMode,
  onRealtimeToggle,
  onCount,
  onReset,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="文章を入力または貼り付けてください"
        className="w-full min-h-[300px] resize-y rounded-xl border border-gray-200 bg-white p-4 text-base leading-relaxed shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={realtimeMode}
            onChange={(e) => onRealtimeToggle(e.target.checked)}
            className="h-4 w-4 accent-blue-500"
          />
          リアルタイム
        </label>
        {!realtimeMode && (
          <button
            onClick={onCount}
            className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600 active:scale-95"
          >
            カウント
          </button>
        )}
        <button
          onClick={onReset}
          className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 active:scale-95 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
