"use client";

import { useState, useMemo, useCallback } from "react";
import CountDisplay from "@/components/CountDisplay";
import { countChars } from "@/lib/counter";

export default function Home() {
  const [text, setText] = useState("");

  const result = useMemo(() => countChars(text), [text]);

  const handleReset = useCallback(() => setText(""), []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          テキストメーター
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          文字数を即時カウント
        </p>
      </header>

      <main className="flex flex-1 flex-col px-[15%]">
        {/* 上段：カウント結果 */}
        <section className="border-b border-gray-200 bg-gray-50 px-8 py-6 dark:border-gray-800 dark:bg-gray-900">
          <CountDisplay result={result} />
        </section>

        {/* 下段：テキスト入力 */}
        <section className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-3 dark:border-gray-800">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              入力
            </span>
            <button
              onClick={handleReset}
              className="rounded-md border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              リセット
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="文章を入力または貼り付けてください"
            className="flex-1 resize-none bg-white px-8 py-6 text-base leading-relaxed text-gray-800 placeholder-gray-300 focus:outline-none dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-700"
          />
        </section>
      </main>
    </div>
  );
}
