'use client';

import { useEffect, useState } from 'react';

type Seg = [text: string, cls: string];

// هر خط از چند تکه‌ی رنگی ساخته می‌شود (k: کلمه‌ی کلیدی، f: تابع، s: رشته، p: علامت، c: کامنت، ok: موفقیت)
const LINES: Seg[][] = [
  [['// vorix.security', 'c']],
  [['await ', 'k'], ['recover', 'f'], ['(', 'p'], ['"hard-drive"', 's'], [');', 'p']],
  [['await ', 'k'], ['secure', 'f'], ['(', 'p'], ['"instagram"', 's'], [');', 'p']],
  [['await ', 'k'], ['install', 'f'], ['(', 'p'], ['"cctv"', 's'], [');', 'p']],
  [['await ', 'k'], ['build', 'f'], ['(', 'p'], ['"website"', 's'], [');', 'p']],
  [['// all services ready ✓', 'ok']],
];

const CLS: Record<string, string> = {
  k: 'text-sky-400',
  f: 'text-cyan-300',
  s: 'text-emerald-300',
  p: 'text-neutral-400',
  c: 'text-neutral-500',
  ok: 'text-cyan-300',
};

const LINE_TEXT = LINES.map((line) => line.map(([t]) => t).join(''));
const FLAT = LINE_TEXT.join('\n');
const TOTAL = FLAT.length;

export default function TypingCode() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setCount(TOTAL);
      return;
    }
    let timer: ReturnType<typeof setTimeout>;
    const step = (i: number) => {
      if (i >= TOTAL) return;
      setCount(i + 1);
      const delay = FLAT[i] === '\n' ? 380 : 30;
      timer = setTimeout(() => step(i + 1), delay);
    };
    timer = setTimeout(() => step(0), 700);
    return () => clearTimeout(timer);
  }, []);

  // پیدا کردن خطی که مکان‌نما در آن است
  let acc = 0;
  let active = LINES.length - 1;
  for (let i = 0; i < LINES.length; i++) {
    const len = LINE_TEXT[i].length;
    if (count <= acc + len) {
      active = i;
      break;
    }
    acc += len + 1;
  }

  let left = count;
  const rows = LINES.map((line, li) => {
    const parts = line.map(([text, cls], si) => {
      if (left <= 0) return null;
      const take = Math.min(left, text.length);
      left -= take;
      return (
        <span key={si} className={CLS[cls]}>
          {text.slice(0, take)}
        </span>
      );
    });
    if (li < LINES.length - 1 && left > 0) left -= 1; // کاراکتر خط بعد
    return (
      <div key={li} className="min-h-[1.7em] whitespace-pre">
        {parts}
        {li === active && <span className="caret" />}
      </div>
    );
  });

  return (
    <div
      dir="ltr"
      aria-hidden="true"
      className="overflow-hidden rounded-2xl border border-cyan-400/25 bg-[#070b14]/95 text-left shadow-[0_20px_60px_-15px_rgba(0,140,255,0.45)] backdrop-blur"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-3 font-mono text-[11px] text-neutral-500">vorix.ts</span>
      </div>
      <div className="px-4 py-3.5 font-mono text-[12px] leading-[1.7] sm:text-[13px]">{rows}</div>
    </div>
  );
}
