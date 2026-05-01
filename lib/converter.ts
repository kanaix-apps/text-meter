// 半角→全角の対応テーブル（ASCII U+0021–U+007E → 全角 U+FF01–U+FF5E）
const HALF_KANA_TO_FULL: Record<string, string> = {
  ｦ: "ヲ",
  ｧ: "ァ",
  ｨ: "ィ",
  ｩ: "ゥ",
  ｪ: "ェ",
  ｫ: "ォ",
  ｬ: "ャ",
  ｭ: "ュ",
  ｮ: "ョ",
  ｯ: "ッ",
  ｰ: "ー",
  ｱ: "ア",
  ｲ: "イ",
  ｳ: "ウ",
  ｴ: "エ",
  ｵ: "オ",
  ｶ: "カ",
  ｷ: "キ",
  ｸ: "ク",
  ｹ: "ケ",
  ｺ: "コ",
  ｻ: "サ",
  ｼ: "シ",
  ｽ: "ス",
  ｾ: "セ",
  ｿ: "ソ",
  ﾀ: "タ",
  ﾁ: "チ",
  ﾂ: "ツ",
  ﾃ: "テ",
  ﾄ: "ト",
  ﾅ: "ナ",
  ﾆ: "ニ",
  ﾇ: "ヌ",
  ﾈ: "ネ",
  ﾉ: "ノ",
  ﾊ: "ハ",
  ﾋ: "ヒ",
  ﾌ: "フ",
  ﾍ: "ヘ",
  ﾎ: "ホ",
  ﾏ: "マ",
  ﾐ: "ミ",
  ﾑ: "ム",
  ﾒ: "メ",
  ﾓ: "モ",
  ﾔ: "ヤ",
  ﾕ: "ユ",
  ﾖ: "ヨ",
  ﾗ: "ラ",
  ﾘ: "リ",
  ﾙ: "ル",
  ﾚ: "レ",
  ﾛ: "ロ",
  ﾜ: "ワ",
  ﾝ: "ン",
  ﾞ: "゛",
  ﾟ: "゜",
};

// 濁点・半濁点の合成テーブル
const DAKUTEN_MAP: Record<string, string> = {
  カ: "ガ",
  キ: "ギ",
  ク: "グ",
  ケ: "ゲ",
  コ: "ゴ",
  サ: "ザ",
  シ: "ジ",
  ス: "ズ",
  セ: "ゼ",
  ソ: "ゾ",
  タ: "ダ",
  チ: "ヂ",
  ツ: "ヅ",
  テ: "デ",
  ト: "ド",
  ハ: "バ",
  ヒ: "ビ",
  フ: "ブ",
  ヘ: "ベ",
  ホ: "ボ",
  ウ: "ヴ",
};

const HANDAKUTEN_MAP: Record<string, string> = {
  ハ: "パ",
  ヒ: "ピ",
  フ: "プ",
  ヘ: "ペ",
  ホ: "ポ",
};

export function halfToFull(text: string): string {
  const chars = Array.from(text);
  const result: string[] = [];

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const cp = ch.codePointAt(0) ?? 0;

    // ASCII英数字・記号 U+0021–U+007E → 全角
    if (cp >= 0x21 && cp <= 0x7e) {
      result.push(String.fromCodePoint(cp + 0xfee0));
      continue;
    }

    // 半角スペース → 全角スペース
    if (ch === " ") {
      result.push("　");
      continue;
    }

    // 半角カタカナ → 全角（濁点・半濁点の合成）
    if (HALF_KANA_TO_FULL[ch]) {
      const full = HALF_KANA_TO_FULL[ch];
      const next = chars[i + 1];
      if (next === "ﾞ" && DAKUTEN_MAP[full]) {
        result.push(DAKUTEN_MAP[full]);
        i++;
      } else if (next === "ﾟ" && HANDAKUTEN_MAP[full]) {
        result.push(HANDAKUTEN_MAP[full]);
        i++;
      } else {
        result.push(full);
      }
      continue;
    }

    result.push(ch);
  }

  return result.join("");
}

export function fullToHalf(text: string): string {
  return Array.from(text)
    .map((ch) => {
      const cp = ch.codePointAt(0) ?? 0;

      // 全角英数字・記号 U+FF01–U+FF5E → 半角
      if (cp >= 0xff01 && cp <= 0xff5e) {
        return String.fromCodePoint(cp - 0xfee0);
      }

      // 全角スペース → 半角スペース
      if (ch === "　") return " ";

      // 全角カタカナ → 半角（逆引き）
      const halfEntry = Object.entries(HALF_KANA_TO_FULL).find(
        ([, v]) => v === ch,
      );
      if (halfEntry) return halfEntry[0];

      // 濁音・半濁音の逆変換
      const dakuEntry = Object.entries(DAKUTEN_MAP).find(([, v]) => v === ch);
      if (dakuEntry) return HALF_KANA_TO_FULL[dakuEntry[0]] + "ﾞ" || ch;

      const handakuEntry = Object.entries(HANDAKUTEN_MAP).find(
        ([, v]) => v === ch,
      );
      if (handakuEntry) return HALF_KANA_TO_FULL[handakuEntry[0]] + "ﾟ" || ch;

      return ch;
    })
    .join("");
}

// 現在のテキストが主に半角かどうかを判定してトグル
export function toggle(text: string): string {
  const halfCount = Array.from(text).filter((ch) => {
    const cp = ch.codePointAt(0) ?? 0;
    return (cp >= 0x21 && cp <= 0x7e) || (cp >= 0xff65 && cp <= 0xff9f);
  }).length;

  const fullCount = Array.from(text).filter((ch) => {
    const cp = ch.codePointAt(0) ?? 0;
    return cp >= 0xff01 && cp <= 0xff5e;
  }).length;

  return halfCount >= fullCount ? halfToFull(text) : fullToHalf(text);
}
