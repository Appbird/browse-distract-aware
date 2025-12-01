import { showFactPrompt } from "./ui.js";

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

  try {
    const result = await showFactPrompt();
    // ひとまずコンソールに出すだけ。
    // 後で background や storage に飛ばしたければ、ここを拡張すればよい。
    console.log("[FactPrompt] User purpose:", result.text);
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
