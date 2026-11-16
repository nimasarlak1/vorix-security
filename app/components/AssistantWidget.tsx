'use client';

import { useEffect, useRef, useState } from 'react';
import { ORDER_SERVICES, SITE } from '../data/site';
import { isValidMobile, normalizePhone } from '../lib/validate';

type Msg = { role: 'user' | 'assistant'; content: string };

// دستیار شناور. گفتگو فقط در حافظه‌ی مرورگر می‌ماند و ذخیره نمی‌شود. ثبت سفارش از همین پنجره به همان API سفارش می‌رود.
export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', content: 'سلام! سؤالتان درباره‌ی خدمات را بپرسید. لطفاً رمز، کد تأیید یا اطلاعات بانکی ننویسید.' }]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState(false);
  const [f, setF] = useState({ name: '', phone: '', service: ORDER_SERVICES[0] });
  const [note, setNote] = useState('');
  const end = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [msgs, open, order]);

  async function send() {
    const t = text.trim();
    if (!t || busy) return;
    const next: Msg[] = [...msgs, { role: 'user', content: t }];
    setMsgs(next);
    setText('');
    setBusy(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(1) }),
      });
      const d = await res.json().catch(() => ({}));
      setMsgs([...next, { role: 'assistant', content: d.reply || d.error || `پاسخی دریافت نشد. با ${SITE.phone} تماس بگیرید.` }]);
    } catch {
      setMsgs([...next, { role: 'assistant', content: 'ارتباط برقرار نشد. اینترنت را بررسی کنید.' }]);
    }
    setBusy(false);
  }

  async function submitOrder() {
    setNote('');
    if (f.name.trim().length < 2) return setNote('نام را وارد کنید.');
    if (!isValidMobile(normalizePhone(f.phone))) return setNote('شماره موبایل معتبر نیست (مثال: 09123456789).');
    setBusy(true);
    try {
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, description: 'ثبت‌شده از طریق دستیار سایت', hp: '' }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.success) {
        setOrder(false);
        setF({ name: '', phone: '', service: ORDER_SERVICES[0] });
        setMsgs((m) => [...m, { role: 'assistant', content: 'سفارش شما ثبت شد. به‌زودی با شما تماس می‌گیریم.' }]);
      } else setNote(d.error || 'ثبت انجام نشد. تماس بگیرید.');
    } catch {
      setNote('ارتباط برقرار نشد.');
    }
    setBusy(false);
  }

  const box = { background: '#05070d', color: '#e6eefc', border: '1px solid rgba(255,255,255,.16)', borderRadius: 10, padding: '9px 11px', width: '100%', fontSize: 16 } as const;

  return (
    <div style={{ position: 'fixed', bottom: 16, left: 16, zIndex: 60, fontFamily: 'inherit' }} dir="rtl">
      {open && (
        <div role="dialog" aria-label="دستیار هوشمند" style={{ width: 'min(360px, calc(100vw - 32px))', height: 'min(480px, 70vh)', display: 'flex', flexDirection: 'column', marginBottom: 10, background: '#0b1220', border: '1px solid rgba(34,211,238,.3)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,.5)' }}>
          <div style={{ padding: '10px 14px', background: '#0f1b33', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700 }}>
            <span>دستیار {SITE.name}</span>
            <button onClick={() => setOpen(false)} aria-label="بستن" style={{ background: 'none', border: 0, color: '#9ca3af', fontSize: 20, cursor: 'pointer' }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-start' : 'flex-end', maxWidth: '85%', background: m.role === 'user' ? 'rgba(34,211,238,.15)' : 'rgba(255,255,255,.07)', padding: '8px 12px', borderRadius: 12, fontSize: 14, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{m.content}</div>
            ))}
            {busy && <div style={{ color: '#94a3b8', fontSize: 13 }}>در حال نوشتن…</div>}
            <div ref={end} />
          </div>
          {order ? (
            <div style={{ padding: 12, display: 'grid', gap: 8, borderTop: '1px solid rgba(255,255,255,.08)' }}>
              <input style={box} placeholder="نام و نام خانوادگی" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={80} />
              <input style={{ ...box, textAlign: 'left' }} dir="ltr" inputMode="tel" placeholder="09123456789" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} maxLength={20} />
              <select style={box} value={f.service} onChange={(e) => setF({ ...f, service: e.target.value })}>
                {ORDER_SERVICES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {note && <div style={{ color: '#fca5a5', fontSize: 13 }}>{note}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button disabled={busy} onClick={submitOrder} style={{ flex: 1, padding: 10, borderRadius: 10, border: 0, background: '#22d3ee', color: '#03101a', fontWeight: 700 }}>ارسال سفارش</button>
                <button onClick={() => setOrder(false)} style={{ padding: 10, borderRadius: 10, border: '1px solid rgba(255,255,255,.2)', background: 'none', color: '#e6eefc' }}>بازگشت</button>
              </div>
            </div>
          ) : (
            <div style={{ padding: 10, borderTop: '1px solid rgba(255,255,255,.08)' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={box} placeholder="پیام خود را بنویسید…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} maxLength={500} />
                <button disabled={busy} onClick={send} style={{ padding: '0 14px', borderRadius: 10, border: 0, background: '#22d3ee', color: '#03101a', fontWeight: 700 }}>ارسال</button>
              </div>
              <button onClick={() => setOrder(true)} style={{ marginTop: 8, background: 'none', border: 0, color: '#22d3ee', fontSize: 13, cursor: 'pointer' }}>ثبت سفارش از همین‌جا ←</button>
            </div>
          )}
        </div>
      )}
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} style={{ padding: '12px 18px', borderRadius: 999, border: 0, background: 'linear-gradient(90deg,#1f6bff,#22d3ee)', color: '#03101a', fontWeight: 800, boxShadow: '0 6px 24px rgba(34,211,238,.35)', cursor: 'pointer' }}>
        {open ? 'بستن' : '💬 دستیار'}
      </button>
    </div>
  );
}
