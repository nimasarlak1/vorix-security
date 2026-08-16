export async function POST(request: Request) {
  try {
    const { name, phone, details } = await request.json();
    
    const BOT_TOKEN = "8949625828:AAG9f6Ve6HXLI4cCOxsLrNicNlQYRGnQSZM";
    const CHAT_ID = "1039217150";

    const message = `🛒 سفارش جدید:
نام: ${name}
تلفن: ${phone}
توضیحات: ${details}`;

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false }, { status: 500 });
  }
}

