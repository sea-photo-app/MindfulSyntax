/**
 * Тихие звуки сада на WebAudio.
 * Никаких внешних файлов: всё синтезируется, поэтому сайт работает офлайн.
 * По умолчанию выключено — звук включается осознанно.
 */

let ctx = null;
let enabled = false;
let master = null;

function ensureContext() {
  if (ctx) return ctx;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  ctx = new AudioContext();
  master = ctx.createGain();
  master.gain.value = 0.18;
  master.connect(ctx.destination);
  return ctx;
}

export function setSoundEnabled(on) {
  enabled = Boolean(on);
  if (enabled) {
    const context = ensureContext();
    if (context && context.state === "suspended") context.resume();
  }
}

export function isSoundEnabled() {
  return enabled;
}

function tone({ freq = 440, type = "sine", duration = 0.35, gain = 0.5, slide = 0, delay = 0 }) {
  if (!enabled) return;
  const context = ensureContext();
  if (!context) return;
  const now = context.currentTime + delay;
  const osc = context.createOscillator();
  const envelope = context.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), now + duration);
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(gain, now + 0.015);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(envelope);
  envelope.connect(master);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

/** Мягкая капля воды — успех, правильный ответ. */
export function playDrop() {
  tone({ freq: 720, type: "sine", duration: 0.24, gain: 0.35, slide: 180 });
  tone({ freq: 1080, type: "sine", duration: 0.18, gain: 0.12, delay: 0.04 });
}

/** Тёплый «ток» по дереву — небольшое действие. */
export function playTick() {
  tone({ freq: 380, type: "triangle", duration: 0.07, gain: 0.18 });
}

/** Глухой камешек — ошибка, но без драмы. */
export function playStone() {
  tone({ freq: 190, type: "sine", duration: 0.26, gain: 0.28, slide: -60 });
}

/** Короткий перезвон — достижение или завершение урока. */
export function playChime() {
  [523.25, 659.25, 783.99].forEach((freq, index) => {
    tone({ freq, type: "sine", duration: 0.5, gain: 0.22, delay: index * 0.09 });
  });
}
