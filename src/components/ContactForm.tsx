"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle, Send } from "lucide-react";
import { validateContact, type ContactErrors, type ContactPayload } from "@/lib/contact";

type Option = { value: string; label: string };

function FieldError({ name, error }: { name: keyof ContactPayload; error?: string }) {
  return error ? (
    <p id={`f-${name}-err`} className="error" role="alert">
      {error}
    </p>
  ) : null;
}

export function ContactForm({ topics, hotline }: { topics: Option[]; hotline: string }) {
  const params = useSearchParams();
  const product = params.get("san-pham");
  const presetTopic = params.get("giai-phap") || params.get("dich-vu") || (product ? "san-pham" : "");
  const sent = params.get("gui"); // set by the API after a no-JS submission

  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [serverMsg, setServerMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const read = (form: HTMLFormElement): ContactPayload => {
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? "");
    return { name: s("name"), phone: s("phone"), email: s("email"), company: s("company"), topic: s("topic"), message: s("message"), website: s("website") };
  };

  const onBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    const field = (e.target as Element).getAttribute("name") as keyof ContactPayload | null;
    if (!field || !(field in errors) || !formRef.current) return;
    const next = validateContact(read(formRef.current));
    setErrors((prev) => ({ ...prev, [field]: next[field] }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = read(form);
    const found = validateContact(data);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setServerMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string; errors?: ContactErrors };
      if (!res.ok) {
        if (json.errors) setErrors(json.errors);
        throw new Error(json.message || "Gửi không thành công.");
      }
      setStatus("ok");
      setServerMsg(json.message || "Cảm ơn bạn! SKV sẽ liên hệ lại trong thời gian sớm nhất.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setServerMsg(`${(err as Error).message} Vui lòng thử lại hoặc gọi hotline ${hotline}.`);
    } finally {
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  const fieldProps = (name: keyof ContactPayload) => ({
    id: `f-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `f-${name}-err` : undefined,
  });

  // method/action make the form work (and keep data out of the URL) even before JS has loaded.
  return (
    <form ref={formRef} className="form" method="post" action="/api/contact" noValidate onSubmit={onSubmit} onBlur={onBlur}>
      <div className="form-row">
        <div className="field" data-invalid={!!errors.name}>
          <label htmlFor="f-name">
            Họ và tên <span className="req">*</span>
          </label>
          <input {...fieldProps("name")} type="text" autoComplete="name" required />
          <FieldError name="name" error={errors.name} />
        </div>
        <div className="field" data-invalid={!!errors.phone}>
          <label htmlFor="f-phone">
            Số điện thoại <span className="req">*</span>
          </label>
          <input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" required />
          <FieldError name="phone" error={errors.phone} />
        </div>
      </div>

      <div className="form-row">
        <div className="field" data-invalid={!!errors.email}>
          <label htmlFor="f-email">Email</label>
          <input {...fieldProps("email")} type="email" autoComplete="email" />
          <FieldError name="email" error={errors.email} />
        </div>
        <div className="field">
          <label htmlFor="f-company">Cơ quan / Doanh nghiệp</label>
          <input {...fieldProps("company")} type="text" autoComplete="organization" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-topic">Bạn quan tâm đến</label>
        <select {...fieldProps("topic")} defaultValue={presetTopic}>
          <option value="">Chọn giải pháp hoặc dịch vụ</option>
          {topics.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
          <option value="san-pham">Báo giá sản phẩm</option>
          <option value="khac">Khác</option>
        </select>
      </div>

      <div className="field" data-invalid={!!errors.message}>
        <label htmlFor="f-message">
          Nhu cầu của bạn <span className="req">*</span>
        </label>
        <textarea
          {...fieldProps("message")}
          required
          defaultValue={product ? `Tôi cần báo giá sản phẩm: ${product}.\n` : ""}
          aria-describedby={errors.message ? "f-message-err" : "f-message-help"}
        />
        {errors.message ? (
          <FieldError name="message" error={errors.message} />
        ) : (
          <p id="f-message-help" className="help">
            Ví dụ: không gian, kích thước dự kiến, địa điểm, thời gian triển khai, ngân sách tham khảo.
          </p>
        )}
      </div>

      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite">
        {(status === "ok" || status === "error") && <p className={`form-status ${status === "ok" ? "ok" : "err"}`}>{serverMsg}</p>}
        {status === "idle" && sent === "ok" && <p className="form-status ok">Cảm ơn bạn! SKV đã nhận được yêu cầu và sẽ liên hệ lại sớm.</p>}
        {status === "idle" && sent === "loi" && (
          <p className="form-status err">Chưa gửi được yêu cầu – vui lòng kiểm tra thông tin hoặc gọi hotline {hotline}.</p>
        )}
      </div>

      <div>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"} style={{ minWidth: 200 }}>
          {status === "sending" ? (
            <>
              <LoaderCircle size={18} className="spin" aria-hidden="true" /> Đang gửi…
            </>
          ) : (
            <>
              <Send size={18} aria-hidden="true" /> Gửi yêu cầu tư vấn
            </>
          )}
        </button>
        <p className="help small muted" style={{ marginTop: 12 }}>
          Thông tin của bạn chỉ được dùng để SKV liên hệ tư vấn, không chia sẻ cho bên thứ ba.
        </p>
      </div>
    </form>
  );
}
