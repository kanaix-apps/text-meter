"use client";

import type { CountResult } from "@/lib/counter";

type Props = {
  result: CountResult | null;
};

type Item = {
  label: string;
  value: number | string;
  unit?: string;
  highlight?: boolean;
};

const Card = ({ item }: { item: Item }) => (
  <div
    className={`rounded-lg p-3 ${
      item.highlight
        ? "bg-blue-50 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:ring-blue-800"
        : "bg-white ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700"
    }`}
  >
    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
    <p
      className={`mt-1 text-xl font-bold tabular-nums leading-tight ${
        item.highlight
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-800 dark:text-gray-100"
      }`}
    >
      {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
      <span className="ml-1 text-xs font-normal text-gray-400">{item.unit}</span>
    </p>
  </div>
);

export default function CountDisplay({ result }: Props) {
  if (!result) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-300 dark:text-gray-600">
        テキストを入力するとカウントが表示されます
      </div>
    );
  }

  const mainItems: Item[] = [
    { label: "全文字数", value: result.total, unit: "字", highlight: true },
    { label: "改行除く", value: result.withoutNewline, unit: "字" },
    { label: "空白・改行除く", value: result.withoutSpace, unit: "字" },
    { label: "行数", value: result.lines, unit: "行" },
    { label: "原稿用紙", value: result.manuscript.toFixed(1), unit: "枚" },
  ];

  if (result.variationSelectors > 0) {
    mainItems.splice(1, 0, {
      label: "異体字",
      value: result.variationSelectors,
      unit: "個",
    });
  }

  const byteItems: Item[] = [
    { label: "UTF-8", value: result.bytes.utf8, unit: "バイト" },
    { label: "UTF-16", value: result.bytes.utf16, unit: "バイト" },
    { label: "Shift-JIS", value: result.bytes.shiftjis, unit: "バイト" },
    { label: "EUC-JP", value: result.bytes.eucjp, unit: "バイト" },
    { label: "JIS", value: result.bytes.jis, unit: "バイト" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          文字数
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {mainItems.map((item) => (
            <Card key={item.label} item={item} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          バイト数
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {byteItems.map((item) => (
            <Card key={item.label} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
