"use client";

import { useState, useMemo, useCallback } from "react";
import CountDisplay from "@/components/CountDisplay";
import { countChars } from "@/lib/counter";

export default function Home() {
  const [text, setText] = useState("");

  const result = useMemo(() => countChars(text), [text]);

  const handleReset = useCallback(() => setText(""), []);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="shrink-0 border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-800 dark:bg-gray-950">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          テキストメーター
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          文字数を即時カウント
        </p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col px-[15%]">
        {/* 上段：カウント結果 */}
        <section className="shrink-0 border-b border-gray-200 bg-gray-50 px-8 py-6 dark:border-gray-800 dark:bg-gray-900">
          <CountDisplay result={result} />
        </section>

        {/* 下段：テキスト入力 */}
        <section className="flex min-h-0 flex-1 flex-col mb-[5%]">
          <div className="shrink-0 flex items-center justify-between border-b border-gray-100 px-6 py-3 dark:border-gray-800">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              入力
            </span>
            <div className="group relative">
              <button
                onClick={handleReset}
                disabled={!text}
                className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 active:scale-95 disabled:opacity-30 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                aria-label="クリア"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="pointer-events-none absolute right-0 top-8 whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-gray-600">
                クリア
              </span>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="文章を入力または貼り付けてください"
            className="min-h-0 flex-1 resize-none bg-white px-8 py-6 text-base leading-relaxed text-gray-800 placeholder-gray-300 focus:outline-none dark:bg-gray-950 dark:text-gray-100 dark:placeholder-gray-700"
          />
        </section>
      </main>
    </div>
  );
}
