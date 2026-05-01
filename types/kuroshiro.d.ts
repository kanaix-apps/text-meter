declare module "kuroshiro" {
  interface ConvertOptions {
    system?: "hepburn" | "nippon" | "passport";
    mode?: "normal" | "spaced" | "okurigana" | "furigana";
    to?: "hiragana" | "katakana" | "romaji";
    delimiter_start?: string;
    delimiter_end?: string;
  }

  interface Analyzer {
    init(): Promise<void>;
  }

  class Kuroshiro {
    init(analyzer: Analyzer): Promise<void>;
    convert(str: string, options?: ConvertOptions): Promise<string>;
    static Util: {
      isHiragana(ch: string): boolean;
      isKatakana(ch: string): boolean;
      isKana(ch: string): boolean;
      isKanji(ch: string): boolean;
      isJapanese(ch: string): boolean;
      hasHiragana(str: string): boolean;
      hasKatakana(str: string): boolean;
      hasKanji(str: string): boolean;
      hasJapanese(str: string): boolean;
      kanaToHiragna(str: string): string;
      kanaToKatakana(str: string): string;
    };
  }

  export default Kuroshiro;
}

declare module "kuroshiro-analyzer-kuromoji" {
  import type { Analyzer } from "kuroshiro";
  class KuromojiAnalyzer implements Analyzer {
    init(): Promise<void>;
  }
  export default KuromojiAnalyzer;
}
