import Encoding from "encoding-japanese";

export type CountResult = {
  total: number;
  withoutNewline: number;
  withoutSpace: number;
  lines: number;
  manuscript: number;
  variationSelectors: number;
  bytes: {
    utf8: number;
    utf16: number;
    shiftjis: number;
    eucjp: number;
    jis: number;
  };
};

// Variation Selectors: U+FE00–U+FE0F, U+E0100–U+E01EF, 絵文字修飾子 U+1F3FB–U+1F3FF
function isVariationSelector(cp: number): boolean {
  return (
    (cp >= 0xfe00 && cp <= 0xfe0f) ||
    (cp >= 0xe0100 && cp <= 0xe01ef) ||
    (cp >= 0x1f3fb && cp <= 0x1f3ff)
  );
}

// 400字詰め原稿用紙のマス位置をシミュレートして枚数を算出
function calcManuscript(text: string): number {
  const COLS = 20;
  const ROWS = 20;
  const PAGE = COLS * ROWS;

  // 禁則文字（行頭禁止）
  const lineStartForbidden = new Set([
    "、",
    "。",
    "」",
    "』",
    "）",
    "】",
    "〕",
    "｝",
    "・",
    "：",
    "；",
    "？",
    "！",
  ]);

  const chars = Array.from(text);
  let pos = 0; // 現在のマス位置（0-indexed）

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    if (ch === "\n") {
      // 改行：次の行の先頭へ
      const currentRow = Math.floor(pos / COLS);
      pos = (currentRow + 1) * COLS;
      continue;
    }

    const nextCh = chars[i + 1];
    const colInRow = pos % COLS;

    // 行末禁則：次の文字が行頭禁止文字で、かつ現在が行末（COLS-1列目）
    if (colInRow === COLS - 1 && nextCh && lineStartForbidden.has(nextCh)) {
      // 現在の文字と次の禁則文字を同じマスに収める（2文字で1マス）
      pos++;
      i++; // 禁則文字もここで消費
      continue;
    }

    pos++;
  }

  if (pos === 0) return 0;
  return Math.ceil(pos / PAGE * 10) / 10;
}

export function countChars(text: string): CountResult {
  if (text.length === 0) {
    return {
      total: 0,
      withoutNewline: 0,
      withoutSpace: 0,
      lines: 1,
      manuscript: 0,
      variationSelectors: 0,
      bytes: { utf8: 0, utf16: 0, shiftjis: 0, eucjp: 0, jis: 0 },
    };
  }

  const codePoints = Array.from(text);
  let total = 0;
  let vsCount = 0;

  for (let i = 0; i < codePoints.length; i++) {
    const cp = codePoints[i].codePointAt(0) ?? 0;
    if (isVariationSelector(cp)) {
      vsCount++;
      // VSは前の文字と合わせて「前の文字の1文字分」に加算（X仕様：VS自体も1カウント）
      total++;
    } else {
      total++;
    }
  }

  // 改行除く
  const withoutNewline = total - (text.match(/\n/g)?.length ?? 0);

  // 改行・空白除く（半角スペース、全角スペース、タブ）
  const spaceCount = (text.match(/[ 　\t\n]/g)?.length ?? 0);
  const withoutSpace = total - spaceCount;

  // 行数
  const lines = text.split("\n").length;

  // 原稿用紙
  const manuscript = calcManuscript(text);

  // バイト数
  const utf8 = new TextEncoder().encode(text).length;
  const utf16 = text.length * 2;

  const codeArray = Encoding.stringToCode(text);
  const shiftjis = Encoding.convert(codeArray, {
    to: "SJIS",
    from: "UNICODE",
  }).length;
  const eucjp = Encoding.convert(codeArray, {
    to: "EUCJP",
    from: "UNICODE",
  }).length;
  const jis = Encoding.convert(codeArray, {
    to: "JIS",
    from: "UNICODE",
  }).length;

  return {
    total,
    withoutNewline,
    withoutSpace,
    lines,
    manuscript,
    variationSelectors: vsCount,
    bytes: { utf8, utf16, shiftjis, eucjp, jis },
  };
}
