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
function addImeAwareEnterListener(
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

function attachOkButton(
    buttonRow:HTMLDivElement,
    input:HTMLTextAreaElement,
    submit:() => void
) {
    const okButton = document.createElement("button");
    okButton.className = "fp-button fp-button-primary";
    okButton.textContent = "OK";
    buttonRow.appendChild(okButton);
    // IME 対応込みで Enter を送信キーとして扱う
    addImeAwareEnterListener(input, submit);
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
    modal.appendChild(title);

    const input = document.createElement("textarea");
    input.className = "fp-input";
    input.rows = 3;
    modal.appendChild(input);

    if (previousText && previousText.trim().length > 0) {
        attachPreviousPrompt(modal, previousText);
    }

    const errorText = document.createElement("div");
    errorText.className = "fp-error";
    modal.appendChild(errorText);

    const buttonRow = document.createElement("div");
    buttonRow.className = "fp-actions";
    modal.appendChild(buttonRow);    

    // Okボタンのセットアップ
    const cleanup = () => { document.body.removeChild(overlay); };
    const submit = () => {
      const value = input.value.trim();
      if (!value) {
        errorText.textContent = "何かしら目的を書いてください。";
        return;
      }
      cleanup();
      resolve({ text: value });
    };
    attachOkButton(buttonRow, input, submit);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // 初期フォーカス
    input.focus();
    
  });
}
