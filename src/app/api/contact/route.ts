import { validateContact, type ContactPayload } from "@/lib/contact";
import { getService, getSolution } from "@/lib/content";

// Sends contact requests by email through Resend (https://resend.com).
// Required env: RESEND_API_KEY. Optional: CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL.

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  // A plain HTML form post (JS not loaded yet) gets a redirect back to the contact page instead of JSON.
  const isForm = !(request.headers.get("content-type") ?? "").includes("application/json");
  const reply = (message: string, status = 200, extra?: object) =>
    isForm
      ? Response.redirect(new URL(`/lien-he?gui=${status < 300 ? "ok" : "loi"}`, request.url), 303)
      : Response.json({ message, ...extra }, { status });

  let body: Partial<ContactPayload>;
  try {
    body = isForm ? (Object.fromEntries(await request.formData()) as Partial<ContactPayload>) : await request.json();
  } catch {
    return reply("Dữ liệu gửi lên không hợp lệ.", 400);
  }

  const data: ContactPayload = {
    name: String(body.name ?? "").slice(0, 120),
    phone: String(body.phone ?? "").slice(0, 30),
    email: String(body.email ?? "").slice(0, 160),
    company: String(body.company ?? "").slice(0, 160),
    topic: String(body.topic ?? "").slice(0, 80),
    message: String(body.message ?? "").slice(0, 4000),
    website: String(body.website ?? ""),
  };

  // Bots fill the hidden field; pretend success so they don't retry.
  if (data.website) return reply("Cảm ơn bạn!");

  const errors = validateContact(data);
  if (Object.keys(errors).length) {
    return reply("Vui lòng kiểm tra lại thông tin.", 422, { errors });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set – request not delivered");
    return reply("Hệ thống gửi email chưa được cấu hình.", 503);
  }

  const topicLabel =
    getSolution(data.topic)?.name ?? getService(data.topic)?.name ?? (data.topic === "san-pham" ? "Báo giá sản phẩm" : data.topic || "Không chọn");

  const rows: [string, string][] = [
    ["Họ và tên", data.name],
    ["Số điện thoại", data.phone],
    ["Email", data.email || "—"],
    ["Cơ quan / Doanh nghiệp", data.company || "—"],
    ["Quan tâm", topicLabel],
  ];
  const html = `
    <h2 style="font-family:Arial,sans-serif">Yêu cầu tư vấn mới từ website</h2>
    <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6e6e73">${k}</td><td style="padding:6px 0"><b>${escape(v)}</b></td></tr>`).join("")}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${escape(data.message)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "SKV Website <onboarding@resend.dev>",
      to: (process.env.CONTACT_TO_EMAIL || "ceo@skv.lighting").split(",").map((s) => s.trim()),
      reply_to: data.email || undefined,
      subject: `[Website] ${topicLabel} – ${data.name} – ${data.phone}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text());
    return reply("Không gửi được yêu cầu.", 502);
  }

  return reply("Cảm ơn bạn! SKV đã nhận được yêu cầu và sẽ liên hệ lại sớm.");
}
