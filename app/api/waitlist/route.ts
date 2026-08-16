import { NextResponse } from "next/server";
import config from "@/config.json";

// Sanitize user inputs to prevent Telegram HTML parse errors and HTML injection
function escapeHtml(str: string = ""): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let {
      trackingCode,
      model,
      storage,
      color,
      condition,
      intentLabel,
      intentPercent,
      phone,
      name,
      contactMethod,
      timestamp,
    } = body;

    // 1. Validate required fields
    if (!model || !phone) {
      return NextResponse.json(
        { error: "مدل گوشی و شماره تماس الزامی است." },
        { status: 400 }
      );
    }

    // 2. Validate & sanitize phone number (digits only, 10-15 chars)
    const cleanPhone = String(phone).replace(/\D/g, "").slice(0, 15);
    if (cleanPhone.length < 10) {
      return NextResponse.json(
        { error: "شماره موبایل وارد شده معتبر نیست." },
        { status: 400 }
      );
    }

    // 3. Length & type constraints to prevent overflow / spam attacks
    const safeModel = escapeHtml(String(model).slice(0, 80));
    const safeStorage = escapeHtml(String(storage || "مشخص نشده").slice(0, 30));
    const safeColor = escapeHtml(String(color || "فرقی ندارد").slice(0, 50));
    const safeCondition = escapeHtml(String(condition || "در حد نو (کارکرده)").slice(0, 40));
    const safeName = name ? escapeHtml(String(name).slice(0, 70)) : "ثبت نشده";
    const safeContactMethod = escapeHtml(String(contactMethod || "تماس تلفنی 📞").slice(0, 40));
    const safeIntentLabel = escapeHtml(String(intentLabel || "خرید فوری").slice(0, 60));
    const safePercent = Math.min(100, Math.max(1, parseInt(String(intentPercent), 10) || 100));
    const safeTrackingCode = escapeHtml(
      String(trackingCode || `DANI-${Math.floor(1000 + Math.random() * 9000)}`).slice(0, 20)
    );
    const safeTimestamp = escapeHtml(
      String(timestamp || new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })).slice(0, 50)
    );

    // 4. Telegram Bot credentials
    const botToken = process.env.TELEGRAM_BOT_TOKEN || config.telegramBot?.botToken;
    const chatId = process.env.TELEGRAM_CHAT_ID || config.telegramBot?.chatId;

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: "تنظیمات ربات تلگرام پیکربندی نشده است." },
        { status: 500 }
      );
    }

    const messageText = `
🎯 <b>درخواست جدید در صف انتظار آیفون دلخواه</b>
🔢 <b>کد رهگیری:</b> <code>#${safeTrackingCode}</code>
━━━━━━━━━━━━━━━━━━━━
📱 <b>مدل دستگاه:</b> ${safeModel}
💾 <b>ظرفیت:</b> ${safeStorage}
🎨 <b>رنگ انتخابی:</b> ${safeColor}
📦 <b>وضعیت:</b> ${safeCondition}
━━━━━━━━━━━━━━━━━━━━
⚡ <b>درصد و فوریت خرید:</b>
<b>${safePercent}%</b> — ${safeIntentLabel}
━━━━━━━━━━━━━━━━━━━━
👤 <b>نام مشتری:</b> ${safeName}
📞 <b>شماره تماس:</b> <code>${cleanPhone}</code>
💬 <b>روش ترجیحی ارتباط:</b> ${safeContactMethod}
⏰ <b>زمان ثبت:</b> ${safeTimestamp}
━━━━━━━━━━━━━━━━━━━━
📍 <i>ثبت شده از وب‌سایت دانیفون</i>
    `.trim();

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: "HTML",
        }),
      }
    );

    const data = await telegramRes.json();

    if (!data.ok) {
      console.error("Telegram API Error:", data);
      return NextResponse.json(
        { error: data.description || "ارسال پیام به تلگرام با خطا مواجه شد." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, trackingCode: safeTrackingCode });
  } catch (err: any) {
    console.error("Waitlist API Handler Error:", err);
    return NextResponse.json(
      { error: "خطای داخلی در سرور" },
      { status: 500 }
    );
  }
}

