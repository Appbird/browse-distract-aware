
/** この拡張用スタイルの要素 ID。 */
const FACT_PROMPT_STYLE_ID = "fp-style";

/**
 * ファクトプロンプト用のスタイルを、まだ挿入されていなければ head に追加する。
 */
export function insertFactPromptStyle(): void {
  if (document.getElementById(FACT_PROMPT_STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = FACT_PROMPT_STYLE_ID;
  style.textContent = `
    .fp-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .fp-dialog {
      background-color: #ffffff;
      color: #000;
      border-radius: 8px;
      padding: 16px;
      max-width: 480px;
      width: 90%;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
    }

    .fp-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .fp-description {
      font-size: 13px;
      margin-bottom: 12px;
    }

    .fp-input {
      width: 100%;
      box-sizing: border-box;
      resize: vertical;
      margin-bottom: 12px;
    }

    .fp-error {
      color: #d32f2f;
      font-size: 12px;
      height: 16px;
      margin-bottom: 8px;
    }

    .fp-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .fp-button {
      padding: 6px 12px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      font-size: 13px;
    }

    .fp-button-primary {
      background-color: #1976d2;
      color: #ffffff;
    }
      .fp-previous {
    font-size: 12px;
    color: #555;
    background-color: #f5f5f5;
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 8px;
    max-height: 6em;
    overflow: auto;
  }

  .fp-previous-label {
    font-weight: bold;
    margin-bottom: 4px;
  }

  .fp-previous-body {
    white-space: pre-wrap;
  }
  `;
  document.head.appendChild(style);
}
