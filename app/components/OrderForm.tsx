'use client';
import { useState } from 'react';

export default function OrderForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [website, setWebsite] = useState(''); // فیلد مخفی ضداسپم (تله ربات)
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      setStatusMessage('لطفاً فیلدهای ضروری را پر کنید.');
      return;
    }

    setLoading(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: name.trim(), 
          phone: phone.trim(), 
          details: details.trim(),
          website: website // ارسال فیلد تله برای سرور
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMessage('سفارش شما با موفقیت ثبت شد و مستقیماً به تیم VORIX.SECURITY ارسال گردید.');
        setName('');
        setPhone('');
        setDetails('');
      } else {
        setStatusMessage(data.error || 'خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.');
      }
    } catch (err) {
      setStatusMessage('خطای ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gray-900 text-white rounded-xl border border-gray-800 shadow-xl max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 text-green-400 text-center">ثبت سفارش امن - VORIX.SECURITY</h3>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-300">نام و نام خانوادگی:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value.slice(0, 50))}
          maxLength={50}
          required
          className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
          placeholder="نام خود را وارد کنید"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-300">شماره تماس:</label>
        <input 
          type="tel" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value.slice(0, 15))}
          maxLength={15}
          required
          className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
          placeholder="09xxxxxxxx"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm text-gray-300">توضیحات سفارش:</label>
        <textarea 
          value={details} 
          onChange={(e) => setDetails(e.target.value.slice(0, 500))}
          maxLength={500}
          rows={4}
          className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-green-500"
          placeholder="جزئیات درخواست یا خدمات مورد نظر..."
        />
      </div>

      {/* فیلد مخفی ضداسپم (کاربران عادی این را نمی‌بینند اما ربات‌ها پرش می‌کنند) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input 
          type="text" 
          value={website} 
          onChange={(e) => setWebsite(e.target.value)} 
          tabIndex={-1} 
          autoComplete="off"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-green-600 hover:bg-green-500 text-gray-950 font-bold rounded-lg transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'در حال ارسال امن...' : 'ثبت و ارسال سفارش'}
      </button>

      {statusMessage && (
        <p className="mt-4 text-sm text-center text-green-300 bg-gray-800/50 p-2 rounded border border-gray-700">{statusMessage}</p>
      )}
    </form>
  );
}

