'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Reveal from './Reveal';
import { ORDER_SERVICES, SITE } from '../data/site';
import { isValidMobile, normalizePhone } from '../lib/validate';

type Form = { name: string; phone: string; service: string; description: string; hp: string };
type Status = 'idle' | 'loading' | 'success' | 'error';

const INITIAL: Form = {
  name: '',
  phone: '',
  service: ORDER_SERVICES[0],
  description: '',
  hp: '', // فیلد تله‌ی ربات‌ها؛ باید خالی بماند
};

const STEPS = [
  'فرم را با نام و شماره‌ی تماس پر کنید.',
  'درخواست شما در دفتر بررسی می‌شود.',
  'برای هماهنگی با شما تماس می‌گیریم.',
];

export default function OrderForm() {
  const [form, setForm] = useState<Form>(INITIAL);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  const update =
    (key: keyof Form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'loading') return;

    const next: { name?: string; phone?: string } = {};
    if (form.name.trim().length < 2) next.name = 'نام خود را وارد کنید.';
    if (!isValidMobile(normalizePhone(form.phone))) {
      next.phone = 'شماره موبایل را به‌صورت 09123456789 وارد کنید.';
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus('success');
        setMessage('سفارش شما ثبت شد. به‌زودی با شما تماس می‌گیریم.');
        setForm(INITIAL);
      } else {
        setStatus('error');
        setMessage(data.error || `ثبت سفارش انجام نشد. لطفاً با شماره ${SITE.phone} تماس بگیرید.`);
      }
    } catch {
      setStatus('error');
      setMessage('ارتباط با سرور برقرار نشد. اینترنت را بررسی کنید یا با دفتر تماس بگیرید.');
    }
  }

  return (
    <section id="order" className="relative py-20 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">۰۴ — ثبت سفارش</p>
          <h2 className="section-title mt-4">درخواست خود را همین حالا ثبت کنید</h2>
          <p className="mt-4 leading-9 text-neutral-400">
            نیازی به توضیح کامل نیست؛ فقط بگویید چه مشکلی دارید یا چه خدمتی می‌خواهید. جزئیات را هنگام تماس
            هماهنگ می‌کنیم.
          </p>
          <ol className="mt-8 space-y-4">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-sm font-bold text-cyan-200">
                  {i + 1}
                </span>
                <span className="pt-1 text-neutral-300">{s}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
            <div>
              <label htmlFor="of-name" className="mb-2 block text-sm font-bold text-neutral-200">
                نام و نام خانوادگی
              </label>
              <input
                id="of-name"
                type="text"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={update('name')}
                placeholder="مثال: علی رضایی"
                className="field"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'of-name-err' : undefined}
                maxLength={80}
              />
              {errors.name && (
                <p id="of-name-err" className="mt-1.5 text-xs text-red-300">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="of-phone" className="mb-2 block text-sm font-bold text-neutral-200">
                شماره موبایل
              </label>
              <input
                id="of-phone"
                type="tel"
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                value={form.phone}
                onChange={update('phone')}
                placeholder="09123456789"
                className="field text-left"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? 'of-phone-err' : undefined}
                maxLength={20}
              />
              {errors.phone && (
                <p id="of-phone-err" className="mt-1.5 text-xs text-red-300">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="of-service" className="mb-2 block text-sm font-bold text-neutral-200">
                خدمت مورد نظر
              </label>
              <select id="of-service" name="service" value={form.service} onChange={update('service')} className="field">
                {ORDER_SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="of-desc" className="mb-2 block text-sm font-bold text-neutral-200">
                توضیحات <span className="font-normal text-neutral-500">(اختیاری)</span>
              </label>
              <textarea
                id="of-desc"
                name="description"
                rows={4}
                value={form.description}
                onChange={update('description')}
                placeholder="مشکل یا درخواست خود را کوتاه بنویسید..."
                className="field resize-none"
                maxLength={1000}
              />
            </div>

            {/* فیلد تله‌ی ربات‌ها: کاربر واقعی آن را نمی‌بیند */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0">
              <label htmlFor="of-hp">این فیلد را خالی بگذارید</label>
              <input
                id="of-hp"
                type="text"
                name="hp"
                tabIndex={-1}
                autoComplete="off"
                value={form.hp}
                onChange={update('hp')}
              />
            </div>

            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
              {status === 'loading' ? 'در حال ارسال...' : 'ثبت سفارش'}
            </button>

            <div aria-live="polite" role="status">
              {message && (
                <p
                  className={`rounded-xl border px-4 py-3 text-sm ${
                    status === 'success'
                      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                      : 'border-red-400/30 bg-red-400/10 text-red-200'
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
