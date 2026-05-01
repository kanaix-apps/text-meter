"use client";

import { useState, useMemo, useCallback } from "react";
import TextArea from "@/components/TextArea";
import CountDisplay from "@/components/CountDisplay";
import ToolButtons from "@/components/ToolButtons";
import { countChars, type CountResult } from "@/lib/counter";

export default function Home() {
  const [text, setText] = useState("");
  const [realtimeMode, setRealtimeMode] = useState(true);
  const [manualResult, setManualResult] = useState<CountResult | null>(null);

  const realtimeResult = useMemo(
    () => (realtimeMode ? countChars(text) : null),
    [text, realtimeMode],
  );

  const result = realtimeMode ? realtimeResult : manualResult;

  const handleCount = useCallback(() => {
    setManualResult(countChars(text));
  }, [text]);

  const handleReset = useCallback(() => {
    setText("");
    setManualResult(null);
  }, []);

  const handleRealtimeToggle = useCallback((v: boolean) => {
    setRealtimeMode(v);
    setManualResult(null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          テキストメーター
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          文字数・バイト数・原稿用紙枚数を即時カウント
        </p>
      </header>

      <main className="flex flex-1 flex-col gap-0 lg:flex-row">
        {/* 左カラム：入力エリア */}
        <section className="flex flex-col border-b border-gray-200 lg:w-1/2 lg:border-b-0 lg:border-r dark:border-gray-800">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-800">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              入力
            </span>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={realtimeMode}
                  onChange={(e) => handleRealtimeToggle(e.target.checked)}
                  className="h-3.5 w-3.5 accent-blue-500"
                />
                リアルタイム
              </label>
              {!realtimeMode && (
                <button
                  onClick={handleCount}
                  className="rounded-md bg-blue-500 px-3 py-1 text-xs font-medium text-white hover:bg-blue-600 active:scale-95"
                >
                  カウント
                </button>
              )}
              <button
                onClick={handleReset}
                className="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                リセット
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="文章を入力または貼り付けてください"
            className="flex-1 resize-none bg-white p-5 text-base leading-relaxed text-gray-800 placeholder-gray-300 focus:outline-none dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-700 lg:min-h-0"
          />

          <div className="border-t border-gray-100 px-5 py-3 dark:border-gray-800">
            <ToolButtons text={text} onTextChange={setText} />
          </div>
        </section>

        {/* 右カラム：カウント結果 */}
        <section className="flex flex-col bg-gray-50 lg:w-1/2 dark:bg-gray-900">
          <div className="border-b border-gray-100 px-5 py-3 dark:border-gray-800">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              結果
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <CountDisplay result={result} />
          </div>
        </section>
      </main>
    </div>
  );
}
