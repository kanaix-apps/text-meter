"use client";

import { useState } from "react";
import { halfToFull, fullToHalf } from "@/lib/converter";
import { kanaToRomaji, romajiToKana } from "@/lib/romanizer";

type Props = {
  text: string;
  onTextChange: (v: string) => void;
};

export default function ToolButtons({ text, onTextChange }: Props) {
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKanaToRomaji = async () => {
    if (!text || converting) return;
    setConverting(true);
    try {
      const result = await kanaToRomaji(text);
      onTextChange(result);
    } catch (e) {
      console.error(e);
    } finally {
      setConverting(false);
    }
  };

  const btnBase =
    "rounded-lg border px-4 py-2 text-sm font-medium transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed";
  const btnSecondary = `${btnBase} border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700`;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/60">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        テキスト変換
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onTextChange(halfToFull(text))}
          disabled={!text}
          className={btnSecondary}
        >
          半角 → 全角
        </button>
        <button
          onClick={() => onTextChange(fullToHalf(text))}
          disabled={!text}
          className={btnSecondary}
        >
          全角 → 半角
        </button>
        <button
          onClick={handleKanaToRomaji}
          disabled={!text || converting}
          className={btnSecondary}
        >
          {converting ? "変換中…" : "かな → ローマ字"}
        </button>
        <button
          onClick={() => onTextChange(romajiToKana(text))}
          disabled={!text}
          className={btnSecondary}
        >
          ローマ字 → かな
        </button>

        <div className="ml-auto">
          <button
            onClick={handleCopy}
            disabled={!text}
            className={`${btnBase} border-transparent bg-blue-500 px-5 text-white shadow-sm hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700`}
          >
            {copied ? "コピー済み ✓" : "コピー"}
          </button>
        </div>
      </div>
    </div>
  );
}
