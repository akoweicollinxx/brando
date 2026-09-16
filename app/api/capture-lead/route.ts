import { NextRequest, NextResponse } from "next/server";
import { createLead, getEmailSequenceByProject } from "@/lib/db";

// Public endpoint — no auth. Validates projectId exists via foreign key.
export async function POST(request: NextRequest) {
  try {
    const { projectId, name, email, phone } = await request.json();

    if (!projectId || !email?.trim()) {
      return NextResponse.json({ error: "projectId and email are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const lead = await createLead(projectId, email.trim().toLowerCase(), name?.trim(), phone?.trim());

    // Fire welcome email if an active sequence exists
    if (process.env.RESEND_API_KEY) {
      const sequence = await getEmailSequenceByProject(projectId);
      if (sequence?.active && sequence.emails.length > 0) {
        const welcome = sequence.emails[0];
        // Non-blocking send
        fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            subject: welcome.subject,
            body: welcome.body.replace(/\[FIRST_NAME\]/g, name?.split(" ")[0] || "there"),
          }),
        }).catch(() => {/* non-fatal */});
      }
    }

    return NextResponse.json({ success: true, lead_id: lead.id });
  } catch (err: any) {
    // Duplicate email in same project — treat as success
    if (err?.code === "23505") return NextResponse.json({ success: true });
    console.error("[capture-lead]", err);
    return NextResponse.json({ error: "Failed to capture lead" }, { status: 500 });
  }
}
