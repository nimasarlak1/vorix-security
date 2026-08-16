export const runtime = 'edge';

// احراز هویت: چک کردن رمز ادمین
function isAuthorized(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const provided = request.headers.get('x-admin-password');
  return adminPassword && provided === adminPassword;
}

// ۱. خواندن لیست سفارش‌ها (GET)
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'عدم دسترسی' }, { status: 401 });
  }

  // @ts-ignore
  const kv = typeof ORDERS_KV !== 'undefined' ? ORDERS_KV : null;
  if (!kv) return Response.json({ orders: [] });

  const list = await kv.list();
  const orders = [];
  
  for (const key of list.keys) {
    // @ts-ignore
    const val = await kv.get(key.name);
    if (val) orders.push(JSON.parse(val));
  }
  
  // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
  return Response.json({ orders: orders.reverse() });
}

// ۲. تغییر وضعیت سفارش (POST)
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: 'عدم دسترسی' }, { status: 401 });
  }

  const { orderId, newStatus } = await request.json();
  // @ts-ignore
  const kv = typeof ORDERS_KV !== 'undefined' ? ORDERS_KV : null;
  
  const existing = await kv.get(orderId);
  if (!existing) return Response.json({ success: false }, { status: 404 });

  const data = JSON.parse(existing);
  data.status = String(newStatus);
  
  await kv.put(orderId, JSON.stringify(data));
  
  return Response.json({ success: true });
}
