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
    className="flex flex-1 flex-col items-center justify-center rounded-lg py-4"
    style={
      item.highlight
        ? { backgroundColor: "#547792", outline: "1px solid #547792" }
        : { backgroundColor: "#F1EFEC", outline: "1px solid #D4C9BE" }
    }
  >
    <p className="text-xs" style={{ color: item.highlight ? "#D4C9BE" : "#547792" }}>
      {item.label}
    </p>
    <p
      className="mt-1 text-2xl font-bold tabular-nums leading-none"
      style={{ color: item.highlight ? "#F1EFEC" : "#123458" }}
    >
      {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
      <span className="ml-1 text-xs font-normal" style={{ color: item.highlight ? "#D4C9BE" : "#547792" }}>
        {item.unit}
      </span>
    </p>
  </div>
);

export default function CountDisplay({ result }: Props) {
  if (!result) {
    return (
      <div className="flex h-24 items-center justify-center text-sm" style={{ color: "#D4C9BE" }}>
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
    <div className="flex gap-3">
      {items.map((item) => (
        <Card key={item.label} item={item} />
      ))}
    </div>
  );
}
