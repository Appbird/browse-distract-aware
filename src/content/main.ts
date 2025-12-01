import { showFactPrompt } from "./ui.js";

/** 前回入力した「求めていた事実」を保存するキー名。 */
const LAST_FACT_KEY = "lastFact";

/**
 * コンテンツスクリプトのエントリポイント。
 * 対象ページに到達した際に、ユーザの目的を問いかける。
 */
async function main(): Promise<void> {
  // すでにダイアログを表示済みかどうかをざっくり判定。
  // （リロード時に二重表示しない程度の雑なガード）
  if (document.documentElement.dataset.factPromptShown === "true") {
    return;
  }
  document.documentElement.dataset.factPromptShown = "true";

  // 1. 前回の値を取得
  const stored = await chrome.storage.local.get(LAST_FACT_KEY);
  const previousText = typeof stored[LAST_FACT_KEY] === "string" ? stored[LAST_FACT_KEY] : null;


  try {
    const result = await showFactPrompt(previousText);
    // 3. 今回の入力を保存
    await chrome.storage.local.set({
        [LAST_FACT_KEY]: result.text,
    });
  } catch (error) {
    console.error("[FactPrompt] Failed to show prompt:", error);
  }
}

// DOM が使えるタイミングで実行。
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void main();
  });
} else {
  void main();
}
