// ヘボン式ローマ字 → かな のルールテーブル（長いパターン優先）
const ROMAJI_TO_KANA_TABLE: [string, string][] = [
  // 3文字パターン（優先）
  ["shi", "し"],
  ["chi", "ち"],
  ["tsu", "つ"],
  ["sha", "しゃ"],
  ["shu", "しゅ"],
  ["sho", "しょ"],
  ["cha", "ちゃ"],
  ["chu", "ちゅ"],
  ["cho", "ちょ"],
  ["tya", "ちゃ"],
  ["tyu", "ちゅ"],
  ["tyo", "ちょ"],
  ["nya", "にゃ"],
  ["nyu", "にゅ"],
  ["nyo", "にょ"],
  ["mya", "みゃ"],
  ["myu", "みゅ"],
  ["myo", "みょ"],
  ["rya", "りゃ"],
  ["ryu", "りゅ"],
  ["ryo", "りょ"],
  ["hya", "ひゃ"],
  ["hyu", "ひゅ"],
  ["hyo", "ひょ"],
  ["kya", "きゃ"],
  ["kyu", "きゅ"],
  ["kyo", "きょ"],
  ["gya", "ぎゃ"],
  ["gyu", "ぎゅ"],
  ["gyo", "ぎょ"],
  ["bya", "びゃ"],
  ["byu", "びゅ"],
  ["byo", "びょ"],
  ["pya", "ぴゃ"],
  ["pyu", "ぴゅ"],
  ["pyo", "ぴょ"],
  ["dzu", "づ"],
  ["dji", "ぢ"],
  // 2文字パターン
  ["ka", "か"],
  ["ki", "き"],
  ["ku", "く"],
  ["ke", "け"],
  ["ko", "こ"],
  ["sa", "さ"],
  ["si", "し"],
  ["su", "す"],
  ["se", "せ"],
  ["so", "そ"],
  ["ta", "た"],
  ["ti", "ち"],
  ["te", "て"],
  ["to", "と"],
  ["na", "な"],
  ["ni", "に"],
  ["nu", "ぬ"],
  ["ne", "ね"],
  ["no", "の"],
  ["ha", "は"],
  ["hi", "ひ"],
  ["fu", "ふ"],
  ["hu", "ふ"],
  ["he", "へ"],
  ["ho", "ほ"],
  ["ma", "ま"],
  ["mi", "み"],
  ["mu", "む"],
  ["me", "め"],
  ["mo", "も"],
  ["ya", "や"],
  ["yu", "ゆ"],
  ["yo", "よ"],
  ["ra", "ら"],
  ["ri", "り"],
  ["ru", "る"],
  ["re", "れ"],
  ["ro", "ろ"],
  ["wa", "わ"],
  ["wi", "ゐ"],
  ["we", "ゑ"],
  ["wo", "を"],
  ["ga", "が"],
  ["gi", "ぎ"],
  ["gu", "ぐ"],
  ["ge", "げ"],
  ["go", "ご"],
  ["za", "ざ"],
  ["ji", "じ"],
  ["zi", "じ"],
  ["zu", "ず"],
  ["ze", "ぜ"],
  ["zo", "ぞ"],
  ["da", "だ"],
  ["di", "ぢ"],
  ["du", "づ"],
  ["de", "で"],
  ["do", "ど"],
  ["ba", "ば"],
  ["bi", "び"],
  ["bu", "ぶ"],
  ["be", "べ"],
  ["bo", "ぼ"],
  ["pa", "ぱ"],
  ["pi", "ぴ"],
  ["pu", "ぷ"],
  ["pe", "ぺ"],
  ["po", "ぽ"],
  ["fa", "ふぁ"],
  ["fi", "ふぃ"],
  ["fe", "ふぇ"],
  ["fo", "ふぉ"],
  // 1文字パターン
  ["a", "あ"],
  ["i", "い"],
  ["u", "う"],
  ["e", "え"],
  ["o", "お"],
  ["n", "ん"],
];

export function romajiToKana(text: string): string {
  const lower = text.toLowerCase();
  const result: string[] = [];
  let i = 0;

  while (i < lower.length) {
    // 促音（同じ子音が連続）
    if (
      i + 1 < lower.length &&
      lower[i] === lower[i + 1] &&
      lower[i] !== "n" &&
      /[bcdfghjklmnpqrstvwxyz]/.test(lower[i])
    ) {
      result.push("っ");
      i++;
      continue;
    }

    // 撥音（n + 子音、または語末のn）
    if (lower[i] === "n") {
      const next = lower[i + 1];
      if (
        !next ||
        /[bcdfghjklmpqrstvwxyz]/.test(next) ||
        next === "n"
      ) {
        result.push("ん");
        i++;
        // nn は「ん」1つ
        if (next === "n") i++;
        continue;
      }
    }

    // 長音（ou → おう）は変換後の文字列で自然に処理される（o→お、u→う）

    // ルールテーブルマッチ（長いパターン優先）
    let matched = false;
    for (const [rom, kana] of ROMAJI_TO_KANA_TABLE) {
      if (lower.startsWith(rom, i)) {
        result.push(kana);
        i += rom.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      result.push(text[i]);
      i++;
    }
  }

  return result.join("");
}

// kuroshiro を使った かな → ローマ字変換（非同期）
import type Kuroshiro from "kuroshiro";
let kuroshiroInstance: InstanceType<typeof Kuroshiro> | null = null;
let initPromise: Promise<void> | null = null;

export async function initKuroshiro(): Promise<void> {
  if (kuroshiroInstance) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const Kuroshiro = (await import("kuroshiro")).default;
    const KuromojiAnalyzer = (await import("kuroshiro-analyzer-kuromoji"))
      .default;
    kuroshiroInstance = new Kuroshiro();
    await kuroshiroInstance.init(new KuromojiAnalyzer());
  })();

  return initPromise;
}

export async function kanaToRomaji(text: string): Promise<string> {
  await initKuroshiro();
  if (!kuroshiroInstance) throw new Error("kuroshiro not initialized");
  return kuroshiroInstance.convert(text, { system: "hepburn", mode: "spaced" });
}
