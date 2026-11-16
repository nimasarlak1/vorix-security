'use client';

import { useMemo, useState } from 'react';
import OrderForm from '../components/OrderForm';
import { imgSrc } from '../lib/itemspec';

type P = { id: string; title: string; brand?: string; category?: string; specs?: string; image?: string; price?: string; stock?: string; installment?: string };

const CATS: Record<string, string> = { camera: 'دوربین', recorder: 'دستگاه ضبط', hdd: 'هارد', accessory: 'تجهیزات جانبی' };

export default function ProductsClient({ products }: { products: P[] }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [picked, setPicked] = useState<P | null>(null);

  const list = useMemo(() => {
    const n = q.trim().toLowerCase();
    return products.filter((p) => (!cat || p.category === cat) && (!n || `${p.title} ${p.brand || ''} ${p.specs || ''}`.toLowerCase().includes(n)));
  }, [products, q, cat]);

  function inquire(p: P) {
    setPicked(p);
    setTimeout(() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  return (
    <>
      <div className="container-x">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجوی محصول یا برند…"
          className="field"
          aria-label="جستجوی محصول"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {[['', 'همه'], ...Object.entries(CATS)].map(([v, l]) => (
            <button
              key={v || 'all'}
              type="button"
              aria-pressed={cat === v}
              onClick={() => setCat(v)}
              className={`rounded-full border px-4 py-2 text-sm ${cat === v ? 'border-cyan-300 bg-cyan-300 font-bold text-[#03101a]' : 'border-white/15 text-neutral-300'}`}
            >
              {l}
            </button>
          ))}
        </div>

        {list.length === 0 && <p className="mt-8 text-neutral-400">محصولی پیدا نشد.</p>}
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <li key={p.id} className="card flex flex-col p-4">
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgSrc(p.image)} alt={p.title} loading="lazy" decoding="async" className="mb-4 h-48 w-full rounded-xl bg-white/5 object-contain" />
              )}
              <h2 className="font-bold text-white">{p.title}</h2>
              <p className="mt-1 text-xs text-neutral-500">
                {[p.brand, p.category ? CATS[p.category] : ''].filter(Boolean).join(' • ')}
              </p>
              {p.specs && (
                <ul className="mt-3 space-y-1 text-sm text-neutral-400">
                  {p.specs.split('\n').filter(Boolean).slice(0, 5).map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              )}
              {p.installment && (
                <p className="mt-3 whitespace-pre-line rounded-lg border border-amber-300/20 bg-amber-300/5 p-2 text-xs leading-6 text-amber-100/90">
                  شرایط قسطی: {p.installment}
                </p>
              )}
              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-cyan-200">{p.price ? p.price : 'استعلام قیمت'}</span>
                  <span className={p.stock === 'out' ? 'text-red-300' : 'text-emerald-300'}>{p.stock === 'out' ? 'ناموجود' : 'موجود'}</span>
                </div>
                <button type="button" onClick={() => inquire(p)} className="btn-primary mt-3 w-full justify-center">استعلام قیمت</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <OrderForm key={picked?.id || 'none'} defaultService="استعلام قیمت محصولات دوربین مداربسته" defaultDescription={picked ? `استعلام قیمت: ${picked.title}${picked.brand ? ` (${picked.brand})` : ''}` : ''} />
    </>
  );
}
