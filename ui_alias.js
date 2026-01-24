// ui_alias.js
// 契約：本紙_10th_r1 に従う（alias 画面） :contentReference[oaicite:0]{index=0}

export function render(root, ctx) {
  // 必須I/O（契約）：root / ctx.state / ctx.actions
  if (!root || !ctx || !ctx.state || !ctx.actions) return;

  const { state, actions } = ctx;

  // ルートを初期化（DOM生成は許可、#app配下のみ）
  root.innerHTML = "";

  // 基本コンテナ
  const wrap = document.createElement("div");
  wrap.style.minHeight = "100vh";
  wrap.style.display = "flex";
  wrap.style.flexDirection = "column";
  wrap.style.justifyContent = "center";
  wrap.style.alignItems = "center";
  wrap.style.padding = "24px";
  wrap.style.boxSizing = "border-box";
  wrap.style.textAlign = "center";
  wrap.style.userSelect = "none";

  // alias 画面タップで result へ（契約：操作）
  // ※ result=null の場合は actions.go がブロック側で弾く想定（UI側は補完しない）
  wrap.addEventListener("click", () => {
    actions.go("result");
  });

  // result の有無で分岐
  const r = state.result;

  if (r && typeof r === "object" && !Array.isArray(r)) {
    // result がある場合：異名テキスト＋異名画像（存在する場合のみ） :contentReference[oaicite:1]{index=1}
    const title = document.createElement("div");
    title.textContent = String(r.nickname ?? "");
    title.style.fontSize = "40px";
    title.style.lineHeight = "1.2";
    title.style.fontWeight = "800";
    title.style.marginBottom = "18px";
    title.style.wordBreak = "break-word";

    // nickname が未定義の場合、空表示（補完禁止）
    wrap.appendChild(title);

    // aliasImage（存在する場合のみ表示）
    if (typeof r.aliasImage === "string" && r.aliasImage.trim() !== "") {
      const img = document.createElement("img");
      img.alt = "";
      img.src = r.aliasImage;
      img.style.maxWidth = "220px";
      img.style.width = "60%";
      img.style.height = "auto";
      img.style.marginTop = "8px";
      img.style.opacity = "0.98";
      img.draggable = false;
      wrap.appendChild(img);
    }

    const hint = document.createElement("div");
    hint.textContent = "（タップで結果へ）";
    hint.style.fontSize = "14px";
    hint.style.opacity = "0.65";
    hint.style.marginTop = "22px";
    wrap.appendChild(hint);
  } else {
    // result=null の場合：最低限UIのみ（契約）
    // - タイトル表示（alias画面であることが分かる固定文言）
    // - 操作導線（戻る/やり直す/startへ戻る のいずれか1つ）
    // - result参照は禁止（文章/レアリティ/スコア/画像/演出）
    // :contentReference[oaicite:2]{index=2}

    const title = document.createElement("div");
    title.textContent = "ALIAS";
    title.style.fontSize = "22px";
    title.style.fontWeight = "800";
    title.style.letterSpacing = "0.08em";
    title.style.marginBottom = "14px";
    wrap.appendChild(title);

    const msg = document.createElement("div");
    msg.textContent = "診断を続行できませんでした。";
    msg.style.fontSize = "14px";
    msg.style.opacity = "0.75";
    msg.style.marginBottom = "18px";
    wrap.appendChild(msg);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "startへ戻る";
    btn.style.padding = "12px 16px";
    btn.style.borderRadius = "10px";
    btn.style.border = "1px solid rgba(0,0,0,0.2)";
    btn.style.background = "transparent";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "14px";

    // ボタンはクリックで start へ（操作導線）
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // 画面全体タップ（resultへ）を止める
      actions.go("start");
    });

    wrap.appendChild(btn);

    const hint = document.createElement("div");
    hint.textContent = "（タップで結果へ）";
    hint.style.fontSize = "12px";
    hint.style.opacity = "0.55";
    hint.style.marginTop = "16px";
    wrap.appendChild(hint);
  }

  root.appendChild(wrap);
}
