export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, details, service } = body;

    // ۱. اعتبارسنجی اولیه
    if (!name || !phone) {
      return Response.json({ success: false, error: 'اطلاعات ناقص است' }, { status: 400 });
    }

    // ۲. تعریف متغیر KV
    // @ts-ignore
    const kv = typeof ORDERS_KV !== 'undefined' ? ORDERS_KV : null;
    if (!kv) return Response.json({ success: false, error: 'دیتابیس متصل نیست' }, { status: 500 });

    // ۳. ذخیره امن در KV
    const orderId = 'order_' + Date.now();
    const orderData = {
      id: orderId,
      name: String(name).trim(),
      phone: String(phone).trim(),
      service: String(service || 'عمومی').trim(),
      details: String(details || '').trim(),
      status: 'در حال بررسی',
      date: new Date().toLocaleDateString('fa-IR')
    };

    await kv.put(orderId, JSON.stringify(orderData));

    // ۴. ارسال به تلگرام
    const message = `🚨 سفارش جدید (${orderData.service}):
👤 نام: ${orderData.name}
📞 تلفن: ${orderData.phone}
📝 توضیحات: ${orderData.details}`;

    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.CHAT_ID, text: message, parse_mode: 'HTML' }),
    });

    return Response.json({ success: true, orderId });
  } catch (e) {
    return Response.json({ success: false }, { status: 500 });
  }
}
