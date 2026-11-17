/**
 * «Угадай число»: одна попытка в модуле про условия
 * и полноценная игра с шестью попытками после циклов.
 */

import { icon, escapeHtml } from "../ui.js";
import { playDrop, playStone, playChime } from "../audio.js";
import { getState } from "../state.js";

export function mountGuessGame(container, config = {}, { onSolved } = {}) {
  const mode = config.mode === "many" ? "many" : "one";
  const min = Number.isFinite(config.min) ? config.min : 1;
  const max = Number.isFinite(config.max) ? config.max : mode === "one" ? 10 : 20;
  const maxTries = mode === "one" ? 1 : Number(config.maxTries) || 6;
  const hotCold = config.hints === "hotcold"; // уровень 3: «теплее / холоднее» вместо «больше / меньше»

  let secret = mode === "one" ? Number(config.secret) || 7 : randomInt(min, max);
  let tries = 0;
  let finished = false;
  const history = [];

  container.innerHTML = `
    <div class="widget">
      <div class="widget__head">
        <div>
          <span class="widget__label">${icon("target")} Игра</span>
          <h3>${escapeHtml(
            config.title || (mode === "one" ? "Одна попытка" : "Угадайте число"),
          )}</h3>
          <p class="widget__note">${
            mode === "one"
              ? `Компьютер загадал число от ${min} до ${max}. Попытка одна — но подсказка будет.`
              : hotCold
                ? `Число от ${min} до ${max}. Подсказки теперь только «теплее» и «холоднее» — как в детской игре. Попыток: ${maxTries}.`
                : `Число от ${min} до ${max}. У вас ${maxTries} попыток — и подсказка после каждой.`
          }</p>
        </div>
        <span class="badge badge--water" data-tries></span>
      </div>
      <div class="guess">
        <div class="guess__row">
          <input type="number" inputmode="numeric" min="${min}" max="${max}" step="1" data-guess aria-label="Ваше число" placeholder="Число">
          <button class="btn btn--primary btn--small" type="button" data-guess-btn>Проверить</button>
          <div class="guess__tries" data-dots aria-hidden="true"></div>
        </div>
        <div class="guess__hint" data-hint aria-live="polite">Пока пусто. Введите число и нажмите «Проверить».</div>
        <div class="small muted" data-history></div>
        <div>
          <button class="btn btn--ghost btn--small" type="button" data-restart hidden>Ещё раз</button>
        </div>
      </div>
    </div>
  `;

  const input = container.querySelector("[data-guess]");
  const button = container.querySelector("[data-guess-btn]");
  const hint = container.querySelector("[data-hint]");
  const triesBadge = container.querySelector("[data-tries]");
  const historyEl = container.querySelector("[data-history]");
  const dots = container.querySelector("[data-dots]");
  const restart = container.querySelector("[data-restart]");

  function renderTries() {
    triesBadge.textContent = `${Math.min(tries, maxTries)} / ${maxTries}`;
    dots.innerHTML = Array.from({ length: maxTries }, (_, index) => {
      const cls = index < tries ? "guess__try is-used" : "guess__try";
      return `<span class="${cls}">${index + 1}</span>`;
    }).join("");
  }

  function finish(text, state) {
    finished = true;
    hint.className = `guess__hint ${state === "win" ? "is-warm" : "is-cold"}`;
    hint.textContent = text;
    button.disabled = true;
    input.disabled = true;
    restart.hidden = false;
    if (state === "win") {
      if (getState().sound) playChime();
      onSolved?.();
    } else if (getState().sound) {
      playStone();
    }
  }

  function submit() {
    if (finished) return;
    const raw = input.value.trim();
    if (!/^-?\d+$/.test(raw)) {
      hint.className = "guess__hint";
      hint.textContent = "Введите целое число — например, 7.";
      return;
    }
    const guess = Number(raw);
    if (guess < min || guess > max) {
      hint.className = "guess__hint";
      hint.textContent = `Число должно быть от ${min} до ${max}.`;
      return;
    }

    tries += 1;
    history.push(guess);
    historyEl.textContent = history.length > 1 ? `Ваши попытки: ${history.join(", ")}` : "";
    renderTries();

    if (guess === secret) {
      if (getState().sound) playDrop();
      finish(`Точно! Загаданное число — ${secret}.`, "win");
      return;
    }

    const direction = guess < secret ? "мало" : "много";
    if (mode === "one") {
      finish(
        `${guess < secret ? "Мало" : "Много"}. Загадано было ${secret}. В следующий раз обязательно получится — нажмите «Ещё раз».`,
        "lose",
      );
      return;
    }

    if (tries >= maxTries) {
      finish(`Попытки закончились. Загаданное число — ${secret}. «Ещё раз» начнёт новую игру.`, "lose");
      return;
    }

    if (hotCold) {
      const previous = history.length > 1 ? history[history.length - 2] : null;
      const distance = Math.abs(guess - secret);
      let text;
      if (previous === null) text = distance <= Math.ceil((max - min) / 10) ? "Горячо! Совсем рядом." : "Пока прохладно. Попробуйте другое число.";
      else {
        const before = Math.abs(previous - secret);
        text = distance < before ? "Теплее!" : distance > before ? "Холоднее." : "Так же далеко, как и в прошлый раз.";
      }
      hint.className = `guess__hint ${text.startsWith("Холод") || text.startsWith("Пока") ? "is-cold" : "is-warm"}`;
      hint.textContent = `${text} Осталось попыток: ${maxTries - tries}.`;
      input.value = "";
      input.focus();
      return;
    }

    hint.className = "guess__hint is-warm";
    hint.textContent =
      guess < secret
        ? `Мало. Загаданное число больше ${guess}. Осталось попыток: ${maxTries - tries}.`
        : `Много. Загаданное число меньше ${guess}. Осталось попыток: ${maxTries - tries}.`;
    input.value = "";
    input.focus();
  }

  function reset() {
    secret = mode === "one" ? Number(config.secret) || 7 : randomInt(min, max);
    tries = 0;
    finished = false;
    history.length = 0;
    hint.className = "guess__hint";
    hint.textContent = "Новая игра. Введите число.";
    historyEl.textContent = "";
    input.value = "";
    input.disabled = false;
    button.disabled = false;
    restart.hidden = true;
    renderTries();
    input.focus();
  }

  button.addEventListener("click", submit);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  });
  restart.addEventListener("click", reset);

  renderTries();
  if (mode === "one") {
    hint.textContent = `Загадано число от ${min} до ${max}. У вас одна попытка.`;
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
