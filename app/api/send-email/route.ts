import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  if (!resend) {
    return NextResponse.json({ error: "Resend not configured" }, { status: 503 });
  }

  try {
    const { to, subject, body, from } = await request.json();
    if (!to || !subject || !body) {
      return NextResponse.json({ error: "to, subject, body required" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: from || `Brando <noreply@${process.env.RESEND_FROM_DOMAIN || "brando.ai"}>`,
      to: [to],
      subject,
      text: body,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#111">${body.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>").replace(/^/, "<p>").replace(/$/, "</p>")}</div>`,
    });

    if (error) throw error;
    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("[send-email]", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
