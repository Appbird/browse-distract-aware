/**
 * 入力ダイアログの結果を表す型。
 */
export interface FactPromptResult {
  /** ユーザが入力した目的文。 */
  text: string;
}

/**
 * 「何の事実を求めて来ましたか？」という問いを表示し、
 * ユーザが入力を完了するまで待機する。
 *
 * @returns ユーザの入力内容を解決する Promise。
 */
export function showFactPrompt(): Promise<FactPromptResult> {
  return new Promise((resolve) => {
    // オーバーレイ
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999999"; // だいたい何より上に来る値
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    // モーダル本体
    const modal = document.createElement("div");
    modal.style.backgroundColor = "#ffffff";
    modal.style.color = "#000000ff";
    modal.style.borderRadius = "8px";
    modal.style.padding = "16px";
    modal.style.maxWidth = "480px";
    modal.style.width = "90%";
    modal.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)";
    modal.style.fontFamily =
      "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif";

    const title = document.createElement("div");
    title.textContent = "何の不安を解消したいですか？";
    title.style.fontSize = "16px";
    title.style.fontWeight = "bold";
    title.style.marginBottom = "8px";

    

    const input = document.createElement("textarea");
    input.rows = 3;
    input.style.width = "100%";
    input.style.boxSizing = "border-box";
    input.style.resize = "vertical";
    input.style.marginBottom = "12px";

    const errorText = document.createElement("div");
    errorText.style.color = "#d32f2f";
    errorText.style.fontSize = "12px";
    errorText.style.height = "16px";
    errorText.style.marginBottom = "8px";

    const buttonRow = document.createElement("div");
    buttonRow.style.display = "flex";
    buttonRow.style.justifyContent = "flex-end";
    buttonRow.style.gap = "8px";

    const okButton = document.createElement("button");
    okButton.textContent = "OK";
    okButton.style.padding = "6px 12px";
    okButton.style.borderRadius = "4px";
    okButton.style.border = "none";
    okButton.style.cursor = "pointer";
    okButton.style.fontSize = "13px";
    okButton.style.backgroundColor = "#1976d2";
    okButton.style.color = "#ffffff";

    // キャンセルボタンを付けず、「必ず何か書いてもらう」仕様にしている。
    // 必要になったらここに「やめる」ボタンを足せばよい。

    buttonRow.appendChild(okButton);

    modal.appendChild(title);
    modal.appendChild(input);
    modal.appendChild(errorText);
    modal.appendChild(buttonRow);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const cleanup = () => {
      document.body.removeChild(overlay);
    };

    const submit = () => {
      const value = input.value.trim();
      if (!value) {
        errorText.textContent = "何かしら目的を書いてください。";
        return;
      }
      cleanup();
      resolve({ text: value });
    };

    okButton.addEventListener("click", submit);

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submit();
      }
    });

    // 初期フォーカス
    input.focus();
  });
}
