/**
 * Учебная симуляция pip: установка, импорт и requirements.txt.
 * Настоящий pip в браузере не запускается — об этом честно написано на карточке.
 */

import { icon, escapeHtml } from "../ui.js";
import { playDrop, playTick } from "../audio.js";
import { getState } from "../state.js";

export function mountPipSim(container, config = {}, { onSolved } = {}) {
  let installed = false;
  let imported = false;
  let busy = false;
  let requirements = [];
  // Уровни: goal — что засчитывает победу ("import" | "freeze"); typo — в имени пакета есть опечатка.
  const goal = config.goal === "freeze" ? "freeze" : "import";
  const typo = Boolean(config.typo);

  container.innerHTML = `
    <div class="widget">
      <div class="widget__head">
        <div>
          <span class="widget__label">${icon("code")} Терминал</span>
          <h3>${escapeHtml(config.title || "Симуляция установки")}</h3>
          <p class="widget__note">${escapeHtml(
            config.note || "Это учебная симуляция: настоящий pip в браузере не запускается.",
          )}</p>
        </div>
        <span class="badge badge--amber">симуляция</span>
      </div>
      <div class="pip">
        <div class="pip__bar">
          <span class="pip__dot"></span><span class="pip__dot"></span><span class="pip__dot"></span>
          <span class="pip__title">garden-project — терминал</span>
        </div>
        <div class="pip__screen" data-screen aria-live="polite"><span class="muted">$ добро пожаловать в учебный терминал</span></div>
        <div class="pip__actions">
          ${typo ? '<button class="pip-btn" type="button" data-install-typo>pip install emoj</button>' : ""}
          <button class="pip-btn pip-btn--main" type="button" data-install>pip install emoji</button>
          <button class="pip-btn" type="button" data-import disabled>import emoji</button>
          <button class="pip-btn" type="button" data-req disabled>pip freeze &gt; requirements.txt</button>
        </div>
      </div>
      <div class="shopping__code" data-req-file hidden></div>
    </div>
  `;

  const screen = container.querySelector("[data-screen]");
  const installBtn = container.querySelector("[data-install]");
  const importBtn = container.querySelector("[data-import]");
  const reqBtn = container.querySelector("[data-req]");
  const reqFile = container.querySelector("[data-req-file]");
  const typoBtn = container.querySelector("[data-install-typo]");

  function write(html, { clear = false } = {}) {
    if (clear) screen.innerHTML = "";
    const line = document.createElement("div");
    line.innerHTML = html;
    screen.appendChild(line);
    screen.scrollTop = screen.scrollHeight;
  }

  function install() {
    if (busy || installed) return;
    busy = true;
    installBtn.disabled = true;
    write('<span class="muted">$ pip install emoji</span>', { clear: true });
    const steps = [
      ["Collecting emoji", 120],
      ["  Downloading emoji-2.10.1-py3-none-any.whl (250 kB)", 400],
      ["Installing collected packages: emoji", 800],
      ["Successfully installed emoji-2.10.1", 1200],
    ];
    steps.forEach(([text, delay]) => {
      window.setTimeout(() => {
        const isSuccess = text.startsWith("Successfully");
        write(`<span class="${isSuccess ? "ok" : "muted"}">${escapeHtml(text)}</span>`);
        if (isSuccess) {
          installed = true;
          busy = false;
          importBtn.disabled = false;
          reqBtn.disabled = false;
          if (getState().sound) playTick();
        }
      }, delay);
    });
  }

  function runImport() {
    if (!installed || busy) return;
    write('<span class="muted">$ python garden.py</span>');
    write('<span class="muted">&gt;&gt;&gt; import emoji</span>');
    window.setTimeout(() => {
      write(`<span class="ok">&gt;&gt;&gt; print(emoji.emojize(":bamboo: тихий сад"))</span>`);
      write(`<span class="ok">🎍 тихий сад</span>`);
      if (!imported) {
        imported = true;
        if (getState().sound) playDrop();
        if (goal === "import") onSolved?.();
      }
    }, 250);
    importBtn.disabled = true;
  }

  function freeze() {
    if (!installed) return;
    if (!requirements.includes("emoji==2.10.1")) {
      requirements.push("emoji==2.10.1");
    }
    reqFile.hidden = false;
    reqFile.innerHTML = `<span class="tok-com"># requirements.txt</span>\n${escapeHtml(
      requirements.join("\n"),
    )}\n\n<span class="tok-com"># установить всё заново:</span>\n<span class="tok-com"># pip install -r requirements.txt</span>`;
    write('<span class="muted">$ pip freeze &gt; requirements.txt</span>');
    write('<span class="ok">emoji==2.10.1  →  записано в requirements.txt</span>');
    reqBtn.disabled = true;
    if (getState().sound) playTick();
    if (goal === "freeze") onSolved?.();
  }

  function installTypo() {
    if (busy || installed) return;
    write('<span class="muted">$ pip install emoj</span>', { clear: true });
    write('<span class="err">ERROR: Could not find a version that satisfies the requirement emoj</span>');
    write('<span class="err">ERROR: No matching distribution found for emoj</span>');
    write('<span class="muted">Подсказка: проверьте, как написано имя пакета. Pip ищет его по точному названию.</span>');
    if (getState().sound) playTick();
  }

  typoBtn?.addEventListener("click", installTypo);
  installBtn.addEventListener("click", install);
  importBtn.addEventListener("click", runImport);
  reqBtn.addEventListener("click", freeze);
}
