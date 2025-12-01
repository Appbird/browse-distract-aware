import { insertFactPromptStyle } from "./ui_css";

/**
 * 入力ダイアログの結果を表す型。
 */
export interface FactPromptResult {
  /** ユーザが入力した目的文。 */
  text: string;
}

/**
 * textarea に対して、日本語入力変換中の Enter を無視しつつ、
 * Enter で submit を呼び出すキーハンドラを付与する。
 *
 * @param textarea 対象の textarea。
 * @param submit   Enter 確定時に呼び出す関数。
 */
function attachImeAwareEnterSubmit(
  textarea: HTMLTextAreaElement,
  submit: () => void,
): void {
  let isComposing = false;

  textarea.addEventListener("compositionstart", () => {
    isComposing = true;
  });

  textarea.addEventListener("compositionend", () => {
    isComposing = false;
  });

  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // 日本語変換中の Enter は無視
      if ((event as KeyboardEvent).isComposing || isComposing) {
        return;
      }
      event.preventDefault();
      submit();
    }
  });
}

function attachPreviousPrompt(
    modal:HTMLDivElement,
    previousText: string
): void {
    const previous = document.createElement("div");
    previous.className = "fp-previous";

    const label = document.createElement("div");
    label.className = "fp-previous-label";
    label.textContent = "前回の回答";

    const body = document.createElement("div");
    body.className = "fp-previous-body";
    body.textContent = previousText;

    previous.appendChild(label);
    previous.appendChild(body);
    modal.appendChild(previous);
}


/**
 * 「何の事実を求めて来ましたか？」という問いを表示し、
 * ユーザが入力を完了するまで待機する。
 *
 * @returns ユーザの入力内容を解決する Promise。
 */
export function showFactPrompt(
  previousText?: string | null,
): Promise<FactPromptResult> {
  return new Promise((resolve) => {
    insertFactPromptStyle();

    // オーバーレイ
    const overlay = document.createElement("div");
    overlay.className = "fp-overlay";

    // モーダル本体
    const modal = document.createElement("div");
    modal.className = "fp-dialog";

    const title = document.createElement("div");
    title.className = "fp-title";
    title.textContent = "何を不安に思っていますか？";

    const input = document.createElement("textarea");
    input.className = "fp-input";
    input.rows = 3;

    const errorText = document.createElement("div");
    errorText.className = "fp-error";

    const buttonRow = document.createElement("div");
    buttonRow.className = "fp-actions";

    const okButton = document.createElement("button");
    okButton.className = "fp-button fp-button-primary";
    okButton.textContent = "OK";

    // キャンセルボタンを付けず、「必ず何か書いてもらう」仕様にしている。
    // 必要になったらここに「やめる」ボタンを足せばよい。

    buttonRow.appendChild(okButton);

    modal.appendChild(title);
    if (previousText && previousText.trim().length > 0) {
        attachPreviousPrompt(modal, previousText);
    }
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

    // IME 対応込みで Enter を送信キーとして扱う
    attachImeAwareEnterSubmit(input, submit);

    // 初期フォーカス
    input.focus();
  });
}
