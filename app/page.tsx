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
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-7 sm:mb-9">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-50">
          テキストメーター
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          文字数・バイト数・原稿用紙枚数を即時カウント
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <TextArea
          value={text}
          onChange={setText}
          realtimeMode={realtimeMode}
          onRealtimeToggle={handleRealtimeToggle}
          onCount={handleCount}
          onReset={handleReset}
        />

        {result !== null && <CountDisplay result={result} />}

        <ToolButtons text={text} onTextChange={setText} />
      </div>
    </main>
  );
}
