import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export const runtime = 'edge';

export async function GET() {
  try {
    const ordersStore = getStore('orders');
    const { blobs } = await ordersStore.list();
    
    const orders = [];
    for (const blob of blobs) {
      const data = await ordersStore.get(blob.key, { type: 'json' });
      if (data) orders.push(data);
    }

    return NextResponse.json({ success: true, data: orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
