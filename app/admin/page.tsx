'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { KINDS, KIND_LIST, PERMS, PERM_LABELS, imgSrc, type ItemKind, type Perm, type Field } from '../lib/itemspec';

// پنل مدیریت (موبایل‌محور). همه‌ی بخش‌ها در همین فایل‌اند و فقط بخش‌هایی که ادمین به آن‌ها دسترسی دارد دیده می‌شوند.

type Admin = { id: string; username: string; role: 'owner' | 'admin'; perms: Perm[] };

async function api(path: string, init?: RequestInit & { json?: unknown }) {
  const { json, ...rest } = init || {};
  const res = await fetch(path, {
    credentials: 'same-origin',
    cache: 'no-store',
    ...rest,
    ...(json !== undefined ? { method: rest.method || 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(json) } : {}),
  });
  let data: any = null;
  try {
    data = await res.json();
  } catch {}
  if (res.status === 401 && !path.endsWith('/me')) window.location.href = '/admin/login';
  return { res, data };
}
const errText = (r: { res: Response; data: any }) => (r.data?.error || `خطا (کد ${r.res.status})`) + (r.data?.detail ? ` — ${r.data.detail}` : '');

const css = `
.ad{min-height:100vh;background:#05070d;color:#e6eefc;font-family:var(--font-vazir),Tahoma,sans-serif;font-size:15px;line-height:1.8}
.ad *{box-sizing:border-box}
.ad-top{position:sticky;top:0;z-index:20;background:rgba(5,7,13,.92);backdrop-filter:blur(8px);border-bottom:1px solid rgba(255,255,255,.08)}
.ad-bar{max-width:960px;margin:0 auto;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.ad-tabs{max-width:960px;margin:0 auto;padding:0 10px 10px;display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}
.ad-tab{flex:none;padding:8px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:transparent;color:#cbd5e1;font:inherit;font-size:13px;cursor:pointer}
.ad-tab[aria-pressed=true]{background:#22d3ee;color:#03101a;border-color:#22d3ee;font-weight:700}
.ad-main{max-width:960px;margin:0 auto;padding:16px 14px 80px}
.ad-card{background:#0b1220;border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:14px;margin-bottom:12px}
.ad-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.ad-between{justify-content:space-between}
.ad-muted{color:#94a3b8;font-size:12.5px}
.ad-in,.ad-sel,.ad-ta{width:100%;padding:11px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.16);background:#05070d;color:#e6eefc;font:inherit;font-size:16px}
.ad-ta{min-height:96px;resize:vertical}
.ad-lbl{display:block;margin:12px 0 5px;font-size:13px;color:#a5b4c8}
.ad-btn{padding:10px 16px;border-radius:10px;border:1px solid rgba(34,211,238,.5);background:transparent;color:#22d3ee;font:inherit;font-size:14px;cursor:pointer}
.ad-btn.pri{background:#22d3ee;color:#03101a;font-weight:700}
.ad-btn.red{border-color:rgba(248,113,113,.5);color:#f87171}
.ad-btn.sm{padding:6px 12px;font-size:12.5px}
.ad-btn:disabled{opacity:.55}
.ad-chip{display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;border:1px solid currentColor}
.ad-err{color:#fca5a5;background:rgba(248,113,113,.08);border:1px solid rgba(248,113,113,.3);border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:13px}
.ad-ok{color:#86efac;background:rgba(52,211,153,.08);border:1px solid rgba(52,211,153,.3);border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:13px}
.ad-img{width:100%;max-width:220px;height:auto;border-radius:10px;border:1px solid rgba(255,255,255,.12);display:block;margin-top:8px}
.ad-code{direction:ltr;text-align:left;background:#05070d;border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:10px;font-size:12px;word-break:break-all;color:#a5f3fc}
.ad-chk{display:flex;gap:8px;align-items:center;margin:6px 0}
.ad-chk input{width:18px;height:18px}
`;

const STATUS_COLOR: Record<string, string> = {
  'جدید': '#22d3ee', 'در حال بررسی': '#fbbf24', 'انجام شد': '#34d399', 'لغو شد': '#f87171',
  published: '#34d399', draft: '#94a3b8', pending: '#fbbf24',
};
const ORDER_STATUSES = ['جدید', 'در حال بررسی', 'انجام شد', 'لغو شد'];

// ---------------------------------------------------------------- سفارش‌ها
function OrdersTab() {
  const [orders, setOrders] = useState<any[] | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (status) p.set('status', status);
    const r = await api(`/api/admin/orders?${p}`);
    if (r.res.ok && r.data?.success) {
      setOrders(r.data.orders);
      setError('');
    } else setError(errText(r));
  }, [q, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  async function patch(o: any, body: any) {
    setBusy(o.id);
    const r = await api(`/api/admin/orders/${encodeURIComponent(o.id)}`, { method: 'PATCH', json: body });
    setBusy('');
    if (!r.res.ok || !r.data?.success) return setError(errText(r));
    setError('');
    setOrders((l) => (l ? l.map((x) => (x.id === o.id ? { ...x, ...body } : x)) : l));
  }
  async function del(o: any) {
    if (!confirm(`سفارش «${o.name}» برای همیشه حذف شود؟`)) return;
    const r = await api(`/api/admin/orders/${encodeURIComponent(o.id)}`, { method: 'DELETE' });
    if (!r.res.ok || !r.data?.success) return setError(errText(r));
    setOrders((l) => (l ? l.filter((x) => x.id !== o.id) : l));
  }

  return (
    <div>
      <input className="ad-in" placeholder="جستجو در نام، شماره، خدمت و توضیحات…" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="ad-row" style={{ margin: '10px 0' }}>
        {['', ...ORDER_STATUSES].map((s) => (
          <button key={s || 'all'} className="ad-tab" aria-pressed={status === s} onClick={() => setStatus(s)}>
            {s || 'همه'}
          </button>
        ))}
      </div>
      {error && <p className="ad-err" role="alert">{error}</p>}
      {!orders && !error && <p className="ad-muted">در حال بارگذاری…</p>}
      {orders && orders.length === 0 && <p className="ad-muted">سفارشی پیدا نشد.</p>}
      {orders?.map((o) => (
        <div className="ad-card" key={o.id}>
          <div className="ad-row ad-between">
            <div>
              <b>{o.name}</b>
              <div className="ad-muted" dir="ltr" style={{ textAlign: 'right' }}>{o.phone}</div>
            </div>
            <select
              className="ad-sel"
              aria-label="وضعیت سفارش"
              style={{ width: 'auto', minWidth: 130, padding: '7px 10px', fontSize: 14, color: STATUS_COLOR[o.status] || '#e6eefc', borderColor: STATUS_COLOR[o.status] || undefined }}
              value={o.status}
              disabled={busy === o.id}
              onChange={(e) => patch(o, { status: e.target.value })}
            >
              {ORDER_STATUSES.map((st) => <option key={st}>{st}</option>)}
            </select>
          </div>
          <div className="ad-muted" style={{ marginTop: 6 }}>خدمت: {o.service}</div>
          {o.description && <div style={{ marginTop: 4, fontSize: 14 }}>{o.description}</div>}
          {o.note && openId !== o.id && <div className="ad-muted" style={{ marginTop: 6 }}>📝 {o.note}</div>}
          <div className="ad-row" style={{ marginTop: 10 }}>
            <a className="ad-btn sm" href={`tel:${o.phone}`}>تماس</a>
            <a className="ad-btn sm" href={`https://wa.me/98${String(o.phone).replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer">واتساپ</a>
            <button className="ad-btn sm" onClick={() => { setOpenId(openId === o.id ? null : o.id); setNotes((n) => ({ ...n, [o.id]: o.note || '' })); }}>
              {openId === o.id ? 'بستن' : 'یادداشت'}
            </button>
            <span className="ad-muted">{new Date(o.created_at).toLocaleString('fa-IR')}</span>
          </div>
          {openId === o.id && (
            <div style={{ marginTop: 10 }}>
              <label className="ad-lbl">یادداشت (فقط برای خودتان)</label>
              <textarea className="ad-ta" value={notes[o.id] ?? ''} onChange={(e) => setNotes((n) => ({ ...n, [o.id]: e.target.value }))} maxLength={1000} />
              <div className="ad-row" style={{ marginTop: 8 }}>
                <button className="ad-btn pri sm" disabled={busy === o.id} onClick={() => patch(o, { note: notes[o.id] ?? '' })}>ذخیره‌ی یادداشت</button>
                <button className="ad-btn red sm" onClick={() => del(o)}>حذف سفارش</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- آپلود عکس (کوچک‌سازی در خود مرورگر)
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.naturalWidth, h = img.naturalHeight;
      const scale = Math.min(1, 1280 / Math.max(w, h));
      w = Math.round(w * scale); h = Math.round(h * scale);
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) return reject(new Error('مرورگر از پردازش عکس پشتیبانی نمی‌کند.'));
      ctx.drawImage(img, 0, 0, w, h);
      for (const q of [0.82, 0.7, 0.55, 0.4]) {
        const out = c.toDataURL('image/webp', q);
        if (out.startsWith('data:image/webp') && out.length < 440000) return resolve(out);
        if (!out.startsWith('data:image/webp')) {
          const jpg = c.toDataURL('image/jpeg', q);
          if (jpg.length < 440000) return resolve(jpg);
        }
      }
      reject(new Error('عکس خیلی بزرگ است؛ عکس کوچک‌تری انتخاب کنید.'));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('فایل انتخاب‌شده عکس نیست.')); };
    img.src = url;
  });
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(file?: File | null) {
    if (!file) return;
    setBusy(true); setErr('');
    try {
      const dataUrl = await compressImage(file);
      const r = await api('/api/admin/media', { json: { dataUrl } });
      if (!r.res.ok || !r.data?.success) throw new Error(errText(r));
      onChange(r.data.id);
    } catch (e: any) { setErr(e?.message || 'آپلود انجام نشد.'); }
    setBusy(false);
  }
  return (
    <div>
      <input type="file" accept="image/*" onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ''; }} disabled={busy} />
      {busy && <div className="ad-muted">در حال آپلود…</div>}
      {err && <div className="ad-err" style={{ marginTop: 8 }}>{err}</div>}
      {value && (
        <>
          <img className="ad-img" src={imgSrc(value)} alt="" />
          <button type="button" className="ad-btn red sm" style={{ marginTop: 8 }} onClick={() => onChange('')}>حذف عکس</button>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- مدیریت آیتم‌ها (نمونه‌کار، محصول، خدمت، مجوز)
function ItemsTab({ kind }: { kind: ItemKind }) {
  const spec = KINDS[kind];
  const [items, setItems] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState<any | null>(null); // { id?, status, sort, data }
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const r = await api(`/api/admin/items?kind=${kind}`);
    if (r.res.ok && r.data?.success) { setItems(r.data.items); setError(''); } else setError(errText(r));
  }, [kind]);
  useEffect(() => { setItems(null); setForm(null); load(); }, [load]);

  const blank = () => ({ status: 'draft', sort: 0, data: Object.fromEntries(spec.fields.map((f) => [f.key, f.type === 'list' ? [] : ''])) });
  const edit = (it: any) => setForm({ id: it.id, status: it.status, sort: it.sort || 0, data: Object.fromEntries(spec.fields.map((f) => [f.key, it[f.key] ?? (f.type === 'list' ? [] : '')])) });

  async function save() {
    setSaving(true); setError('');
    const body: any = { data: form.data, status: form.status, sort: Number(form.sort) || 0 };
    const r = form.id
      ? await api(`/api/admin/items/${form.id}`, { method: 'PATCH', json: body })
      : await api('/api/admin/items', { json: { ...body, kind } });
    setSaving(false);
    if (!r.res.ok || !r.data?.success) return setError(errText(r));
    setForm(null);
    load();
  }
  async function setStatus(it: any, status: string) {
    const r = await api(`/api/admin/items/${it.id}`, { method: 'PATCH', json: { status } });
    if (!r.res.ok || !r.data?.success) return setError(errText(r));
    load();
  }
  async function del(it: any) {
    if (!confirm(`«${it.title || it.slug}» حذف شود؟`)) return;
    const r = await api(`/api/admin/items/${it.id}`, { method: 'DELETE' });
    if (!r.res.ok || !r.data?.success) return setError(errText(r));
    load();
  }

  const setField = (f: Field, v: any) => setForm((s: any) => ({ ...s, data: { ...s.data, [f.key]: v } }));

  if (form) {
    return (
      <div className="ad-card">
        <b>{form.id ? 'ویرایش' : 'افزودن'} {spec.label}</b>
        {error && <p className="ad-err" role="alert" style={{ marginTop: 10 }}>{error}</p>}
        {spec.fields.map((f) => (
          <div key={f.key}>
            <label className="ad-lbl">{f.label}{f.required ? ' *' : ''}</label>
            {f.type === 'long' && <textarea className="ad-ta" value={form.data[f.key]} maxLength={f.max} onChange={(e) => setField(f, e.target.value)} />}
            {f.type === 'list' && (
              <textarea className="ad-ta" value={(form.data[f.key] as string[]).join('\n')} onChange={(e) => setField(f, e.target.value.split('\n'))} />
            )}
            {f.type === 'select' && (
              <select className="ad-sel" value={form.data[f.key]} onChange={(e) => setField(f, e.target.value)}>
                <option value="">—</option>
                {f.options!.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            )}
            {f.type === 'media' && <ImageField value={form.data[f.key]} onChange={(v) => setField(f, v)} />}
            {(f.type === 'text' || f.type === 'url') && (
              <input className="ad-in" value={form.data[f.key]} maxLength={f.max} dir={f.type === 'url' || f.key === 'slug' ? 'ltr' : undefined} onChange={(e) => setField(f, e.target.value)} />
            )}
          </div>
        ))}
        <label className="ad-lbl">وضعیت نمایش</label>
        <select className="ad-sel" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          {spec.statuses.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
        </select>
        <label className="ad-lbl">ترتیب (عدد کمتر = بالاتر)</label>
        <input className="ad-in" type="number" inputMode="numeric" value={form.sort} onChange={(e) => setForm({ ...form, sort: e.target.value })} />
        <div className="ad-row" style={{ marginTop: 14 }}>
          <button className="ad-btn pri" disabled={saving} onClick={save}>{saving ? 'در حال ذخیره…' : 'ذخیره'}</button>
          <button className="ad-btn" onClick={() => setForm(null)}>انصراف</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="ad-btn pri" onClick={() => setForm(blank())}>+ افزودن {spec.label}</button>
      {kind === 'credential' && <p className="ad-muted" style={{ marginTop: 10 }}>فقط موارد «تأییدشده» در سایت نمایش داده می‌شوند و هیچ موردی به‌صورت پیش‌فرض وجود ندارد. فقط مدرک واقعی اضافه کنید.</p>}
      {kind === 'portfolio' && <p className="ad-muted" style={{ marginTop: 10 }}>سایت‌هایی که کد امضای شما را بگذارند خودکار با وضعیت «در انتظار تأیید» اینجا اضافه می‌شوند و تا تأیید شما نمایش داده نمی‌شوند.</p>}
      {error && <p className="ad-err" role="alert" style={{ marginTop: 10 }}>{error}</p>}
      {!items && !error && <p className="ad-muted">در حال بارگذاری…</p>}
      {items && items.length === 0 && <p className="ad-muted" style={{ marginTop: 10 }}>هنوز موردی اضافه نشده.</p>}
      <div style={{ marginTop: 12 }}>
        {items?.map((it) => (
          <div className="ad-card" key={it.id}>
            <div className="ad-row ad-between">
              <b>{it.title || it.slug}</b>
              <span className="ad-chip" style={{ color: STATUS_COLOR[it.status] || '#94a3b8' }}>{spec.statuses.find((s) => s.v === it.status)?.l || it.status}</span>
            </div>
            {it.image && <img className="ad-img" src={imgSrc(it.image)} alt="" style={{ maxWidth: 120 }} />}
            {it.url && <div className="ad-muted" dir="ltr" style={{ textAlign: 'right' }}>{it.url}</div>}
            {it.pageTitle && <div className="ad-muted">عنوان صفحه: {it.pageTitle}</div>}
            {it.firstSeen && <div className="ad-muted">اولین مشاهده: {new Date(it.firstSeen).toLocaleString('fa-IR')}</div>}
            <div className="ad-row" style={{ marginTop: 10 }}>
              <button className="ad-btn sm" onClick={() => edit(it)}>ویرایش</button>
              {it.status !== 'published' ? (
                <button className="ad-btn pri sm" onClick={() => setStatus(it, 'published')}>{it.status === 'pending' ? 'تأیید و نمایش' : 'نمایش'}</button>
              ) : (
                <button className="ad-btn sm" onClick={() => setStatus(it, 'draft')}>مخفی کردن</button>
              )}
              <button className="ad-btn red sm" onClick={() => del(it)}>{it.status === 'pending' ? 'رد و حذف' : 'حذف'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- ادمین‌ها (فقط مدیر کل)
function AdminsTab() {
  const [list, setList] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', password: '', perms: ['orders'] as Perm[] });
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const r = await api('/api/admin/admins');
    if (r.res.ok && r.data?.success) { setList(r.data.admins); setError(''); } else setError(errText(r));
  }, []);
  useEffect(() => { load(); }, [load]);

  const toggle = (perms: Perm[], p: Perm) => (perms.includes(p) ? perms.filter((x) => x !== p) : [...perms, p]);

  async function create() {
    setMsg(''); setError('');
    const r = await api('/api/admin/admins', { json: form });
    if (!r.res.ok || !r.data?.success) return setError(errText(r));
    setMsg('ادمین ساخته شد. نام کاربری و رمز را به خودش بدهید.');
    setForm({ username: '', password: '', perms: ['orders'] });
    load();
  }
  async function patch(id: string, body: any) {
    const r = await api(`/api/admin/admins/${id}`, { method: 'PATCH', json: body });
    if (!r.res.ok || !r.data?.success) return setError(errText(r));
    setMsg('ذخیره شد.'); load();
  }
  async function del(a: any) {
    if (!confirm(`ادمین «${a.username}» حذف شود؟`)) return;
    const r = await api(`/api/admin/admins/${a.id}`, { method: 'DELETE' });
    if (!r.res.ok || !r.data?.success) return setError(errText(r));
    load();
  }

  return (
    <div>
      {error && <p className="ad-err" role="alert">{error}</p>}
      {msg && <p className="ad-ok">{msg}</p>}
      <div className="ad-card">
        <b>افزودن ادمین</b>
        <label className="ad-lbl">نام کاربری (انگلیسی)</label>
        <input className="ad-in" dir="ltr" autoCapitalize="none" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <label className="ad-lbl">رمز (حداقل ۸ کاراکتر)</label>
        <input className="ad-in" type="text" dir="ltr" autoComplete="off" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="ad-lbl">دسترسی‌ها</label>
        {PERMS.filter((p) => p !== 'settings').map((p) => (
          <label className="ad-chk" key={p}><input type="checkbox" checked={form.perms.includes(p)} onChange={() => setForm({ ...form, perms: toggle(form.perms, p) })} />{PERM_LABELS[p]}</label>
        ))}
        <button className="ad-btn pri" style={{ marginTop: 10 }} onClick={create}>ساخت ادمین</button>
      </div>
      {list?.map((a) => (
        <div className="ad-card" key={a.id}>
          <div className="ad-row ad-between">
            <b dir="ltr">{a.username}</b>
            <span className="ad-chip" style={{ color: a.active ? '#34d399' : '#f87171' }}>{a.active ? 'فعال' : 'غیرفعال'}</span>
          </div>
          <div style={{ marginTop: 6 }}>
            {PERMS.filter((p) => p !== 'settings').map((p) => (
              <label className="ad-chk" key={p}><input type="checkbox" checked={a.perms.includes(p)} onChange={() => patch(a.id, { perms: toggle(a.perms, p) })} />{PERM_LABELS[p]}</label>
            ))}
          </div>
          <div className="ad-row" style={{ marginTop: 8 }}>
            <button className="ad-btn sm" onClick={() => patch(a.id, { active: !a.active })}>{a.active ? 'غیرفعال کردن' : 'فعال کردن'}</button>
            <button className="ad-btn sm" onClick={() => { const p = prompt('رمز جدید (حداقل ۸ کاراکتر):'); if (p) patch(a.id, { password: p }); }}>تغییر رمز</button>
            <button className="ad-btn red sm" onClick={() => del(a)}>حذف</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- تنظیمات
const SIG_SNIPPET = `<a href="https://vorixsecurity.ir" target="_blank" rel="noopener" data-vorix-sig>طراحی شده توسط VORIX.SECURITY</a><script async src="https://vorixsecurity.ir/api/sig/js"></script>`;

function SettingsTab() {
  const [s, setS] = useState<any>(null);
  const [conf, setConf] = useState<any>({});
  const [jobs, setJobs] = useState<any>(null);
  const [loadKey, setLoadKey] = useState(0);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api('/api/admin/settings').then((r) => {
      if (r.res.ok && r.data?.success) { setS(r.data.settings); setConf(r.data.configured); setJobs(r.data.jobs); } else setError(errText(r));
    });
  }, [loadKey]);

  async function save() {
    setError(''); setMsg('');
    const r = await api('/api/admin/settings', { method: 'PUT', json: s });
    if (!r.res.ok || !r.data?.success) return setError(errText(r));
    setMsg('ذخیره شد.');
    setLoadKey((k) => k + 1);
  }
  async function addInPerson() {
    setError(''); setMsg('');
    const r = await api('/api/admin/settings', { method: 'PUT', json: { add_jobs: 1 } });
    if (!r.res.ok || !r.data?.success) return setError(errText(r));
    setMsg('یک کار حضوری اضافه شد.');
    setLoadKey((k) => k + 1);
  }
  async function testAi() {
    setError(''); setMsg('در حال تست دستیار…');
    const r = await api('/api/admin/ai-test', { method: 'POST' });
    if (r.data?.success) setMsg(`دستیار کار می‌کند (مدل ${r.data.model}). پاسخ آزمایشی: ${r.data.reply}`);
    else { setMsg(''); setError(`${r.data?.error || 'خطا'} ${r.data?.model ? `(مدل ${r.data.model})` : ''} ${r.data?.detail ? `— جزئیات: ${r.data.detail}` : ''}`); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(SIG_SNIPPET); setMsg('کد کپی شد.'); } catch { setMsg('کپی نشد؛ کد را با انگشت انتخاب و کپی کنید.'); }
  }

  return (
    <div>
      {error && <p className="ad-err" role="alert">{error}</p>}
      {msg && <p className="ad-ok">{msg}</p>}
      {s && (
        <div className="ad-card">
          {jobs && (
            <p className="ad-muted" style={{ marginBottom: 10 }}>
              عدد نمایش‌داده‌شده در سایت: <b>{jobs.total}</b> = عدد پایه ({jobs.base}) + سفارش‌های «انجام شد» در پنل ({jobs.done}). هر سفارشی که وضعیتش را «انجام شد» کنید خودکار به آن اضافه می‌شود. صفر یعنی در سایت نمایش داده نمی‌شود.
            </p>
          )}
          <button className="ad-btn pri" onClick={addInPerson}>+۱ کار حضوری انجام شد</button>
          <label className="ad-lbl">عدد پایه‌ی کارهای انجام‌شده (کارهای حضوری و قبلی؛ خالی = ۰)</label>
          <input className="ad-in" type="number" inputMode="numeric" value={s.completed_jobs} onChange={(e) => setS({ ...s, completed_jobs: e.target.value })} />
          <label className="ad-chk" style={{ marginTop: 14 }}><input type="checkbox" checked={s.telegram_enabled} onChange={(e) => setS({ ...s, telegram_enabled: e.target.checked })} />ارسال سفارش‌ها به تلگرام {conf.telegram ? '' : '(توکن در Cloudflare تنظیم نشده)'}</label>
          <label className="ad-chk"><input type="checkbox" checked={s.bale_enabled} onChange={(e) => setS({ ...s, bale_enabled: e.target.checked })} />ارسال سفارش‌ها به بله {conf.bale ? '' : '(BALE_BOT_TOKEN و BALE_CHAT_ID در Cloudflare تنظیم نشده)'}</label>
          <label className="ad-chk"><input type="checkbox" checked={!!s.ai_enabled} onChange={(e) => setS({ ...s, ai_enabled: e.target.checked })} />دستیار هوشمند در سایت {conf.ai ? '' : '(Binding با نام AI در Cloudflare ساخته نشده)'}</label>
          <button className="ad-btn pri" style={{ marginTop: 12 }} onClick={save}>ذخیره‌ی تنظیمات</button>
          <button className="ad-btn" style={{ marginTop: 12, marginInlineStart: 8 }} onClick={testAi}>تست دستیار</button>
        </div>
      )}
      <div className="ad-card">
        <b>کد امضای «طراحی شده توسط VORIX.SECURITY»</b>
        <p className="ad-muted">این کد را در فوتر سایت مشتری بگذارید. سایت مشتری خودکار در بخش نمونه‌کارها به‌صورت «در انتظار تأیید» ثبت می‌شود و فقط با تأیید شما نمایش داده می‌شود.</p>
        <div className="ad-code">{SIG_SNIPPET}</div>
        <button className="ad-btn sm" style={{ marginTop: 8 }} onClick={copy}>کپی کد</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- صفحه‌ی اصلی پنل
export default function AdminPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('');

  useEffect(() => {
    api('/api/admin/me').then((r) => {
      if (r.res.status === 401) { window.location.href = '/admin/login'; return; }
      if (r.res.ok && r.data?.success) setAdmin(r.data.admin); else setError(errText(r));
    });
  }, []);

  const tabs = useMemo(() => {
    if (!admin) return [] as { id: string; label: string }[];
    const has = (p: Perm) => admin.role === 'owner' || admin.perms.includes(p);
    const t: { id: string; label: string }[] = [];
    if (has('orders')) t.push({ id: 'orders', label: 'سفارش‌ها' });
    for (const k of KIND_LIST) if (has(KINDS[k].perm)) t.push({ id: k, label: KINDS[k].perm === 'credentials' ? 'مجوزها و همکاری‌ها' : PERM_LABELS[KINDS[k].perm] });
    if (admin.role === 'owner') t.push({ id: 'admins', label: 'ادمین‌ها' });
    if (has('settings')) t.push({ id: 'settings', label: 'تنظیمات و امضا' });
    return t;
  }, [admin]);

  useEffect(() => { if (!tab && tabs.length) setTab(tabs[0].id); }, [tabs, tab]);

  async function logout() {
    try { await api('/api/admin/logout', { method: 'POST' }); } finally { window.location.href = '/admin/login'; }
  }

  return (
    <div className="ad">
      <style>{css}</style>
      <div className="ad-top">
        <div className="ad-bar">
          <b>پنل مدیریت {admin ? <span className="ad-muted" dir="ltr">({admin.username})</span> : null}</b>
          <button className="ad-btn red sm" onClick={logout}>خروج</button>
        </div>
        <div className="ad-tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t.id} className="ad-tab" aria-pressed={tab === t.id} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </div>
      </div>
      <div className="ad-main">
        {error && <p className="ad-err" role="alert">{error}</p>}
        {!admin && !error && <p className="ad-muted">در حال بارگذاری…</p>}
        {admin && tabs.length === 0 && <p className="ad-muted">هنوز به هیچ بخشی دسترسی ندارید. با مدیر کل تماس بگیرید.</p>}
        {tab === 'orders' && <OrdersTab />}
        {(KIND_LIST as string[]).includes(tab) && <ItemsTab key={tab} kind={tab as ItemKind} />}
        {tab === 'admins' && <AdminsTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
