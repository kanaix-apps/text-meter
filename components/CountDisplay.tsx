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
    className={`flex items-center justify-between rounded-lg px-4 py-2.5 ${
      item.highlight
        ? "bg-blue-50 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:ring-blue-800"
        : "bg-white ring-1 ring-gray-100 dark:bg-gray-800 dark:ring-gray-700"
    }`}
  >
    <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
    <p
      className={`text-2xl font-bold tabular-nums leading-none ${
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

  const items: Item[] = [
    { label: "全文字数", value: result.total, unit: "字", highlight: true },
    { label: "改行除く", value: result.withoutNewline, unit: "字" },
    { label: "空白・改行除く", value: result.withoutSpace, unit: "字" },
    { label: "行数", value: result.lines, unit: "行" },
  ];

  if (result.variationSelectors > 0) {
    items.splice(1, 0, {
      label: "異体字",
      value: result.variationSelectors,
      unit: "個",
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Card key={item.label} item={item} />
      ))}
    </div>
  );
}
