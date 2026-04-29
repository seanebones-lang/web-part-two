import { Resend } from "resend";

import { CONTACT_EMAIL } from "@/lib/contact";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, company } = body as {
      name?: string;
      email?: string;
      message?: string;
      company?: string;
    };

    if (!name || !email || !message) {
      return Response.json(
        { ok: false, error: "name, email, and message are required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { ok: false, error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (resend) {
      await resend.emails.send({
        from: "NextEleven Website <noreply@mothership-ai.com>",
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: `New inquiry from ${name}${company ? ` (${company})` : ""}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
        `,
        text: `Name: ${name}\n${company ? `Company: ${company}\n` : ""}Email: ${email}\n\nMessage:\n${message}`,
      });
    } else {
      console.warn(
        "[contact] RESEND_API_KEY not set — email not sent. Payload:",
        { name, email, company, message },
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] Error:", err);
    return Response.json(
      { ok: false, error: "Something went wrong. Please try emailing us directly." },
      { status: 500 },
    );
  }
}
