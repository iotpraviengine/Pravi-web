# Website SKV Lighting

Website giới thiệu giải pháp màn hình LED, đèn sân khấu và thiết bị hiệu ứng của **SKV Lighting**, thiết kế theo phong cách apple.com.
Xây dựng bằng **Next.js 16 (Node.js)**, nội dung lưu trong thư mục `content/`, triển khai trên **Vercel**.

---

## 1. Chạy thử trên máy

Yêu cầu: Node.js 20 trở lên.

```bash
npm install
npm run dev
```

Mở http://localhost:3000.

Kiểm tra trước khi đưa lên mạng:

```bash
npm run lint
npm run build
```

---

## 2. Đưa code lên GitHub

1. Đăng nhập https://github.com → **New repository** → đặt tên, ví dụ `skv-website` → chọn **Private** → **Create repository** (không tick thêm README).
2. Trong thư mục `skv-website`, chạy (thay `TEN-TAI-KHOAN` bằng tài khoản GitHub của bạn):

```bash
git remote add origin https://github.com/TEN-TAI-KHOAN/skv-website.git
git push -u origin main
```

Git đã được khởi tạo sẵn và có commit đầu tiên.

---

## 3. Triển khai lên Vercel

1. Đăng nhập https://vercel.com bằng tài khoản GitHub.
2. **Add New… → Project** → chọn repo `skv-website` → **Import**.
3. Vercel tự nhận Next.js, không cần đổi cấu hình build.
4. Mở mục **Environment Variables**, thêm các biến trong file `.env.example`:

| Biến | Giá trị |
| --- | --- |
| `RESEND_API_KEY` | API key lấy tại https://resend.com/api-keys (bắt buộc để form liên hệ gửi email) |
| `CONTACT_TO_EMAIL` | `ceo@skv.lighting` (hoặc nhiều email, cách nhau dấu phẩy) |
| `CONTACT_FROM_EMAIL` | Tạm để `SKV Website <onboarding@resend.dev>` |
| `NEXT_PUBLIC_SITE_URL` | Khi chạy thử: địa chỉ `https://….vercel.app` Vercel cấp. Khi chính thức: `https://skv.lighting` |

5. Bấm **Deploy**. Vài phút sau website chạy tại địa chỉ `https://….vercel.app`.

Từ đó, mỗi lần `git push` lên nhánh `main`, Vercel tự động cập nhật website.

### Lưu ý về email (Resend)

- Khi chưa xác minh tên miền, Resend chỉ gửi được tới **email đã đăng ký tài khoản Resend**. Nên đăng ký Resend bằng `ceo@skv.lighting`, hoặc
- Xác minh tên miền `skv.lighting` trong Resend (**Domains → Add domain**, thêm các bản ghi DNS được hướng dẫn), rồi đổi `CONTACT_FROM_EMAIL` thành ví dụ `SKV Website <website@skv.lighting>`.
- Nếu thiếu `RESEND_API_KEY`, form vẫn hiển thị nhưng báo lỗi và gợi ý khách gọi hotline.

---

## 4. Chuyển tên miền skv.lighting sang website mới

Làm khi đã duyệt xong bản chạy thử:

1. Vercel → Project → **Settings → Domains** → thêm `skv.lighting` và `www.skv.lighting`.
2. Vào nơi quản lý tên miền, sửa DNS theo đúng giá trị Vercel hiển thị (thường là bản ghi `A` cho `skv.lighting` và `CNAME` cho `www`).
3. Đổi biến `NEXT_PUBLIC_SITE_URL` thành `https://skv.lighting`, rồi **Redeploy**.

Hơn 1.400 đường dẫn cũ của website WordPress (sản phẩm, bài viết, dự án) đã được tự động chuyển hướng 308 sang trang mới tương ứng (`content/legacy-redirects.json`, xử lý trong `src/proxy.ts`), giúp giữ thứ hạng Google.

---

## 5. Cập nhật nội dung

Mọi nội dung nằm trong thư mục `content/`. Sửa file, chạy thử `npm run dev`, rồi `git commit` và `git push`.

| Nội dung | File |
| --- | --- |
| Thông tin công ty, hotline, địa chỉ, số liệu | `content/site.json` |
| 9 giải pháp | `content/solutions.json` |
| 4 dịch vụ | `content/services.json` |
| Danh mục sản phẩm | `content/products.json` |
| Đối tác, thương hiệu | `content/brands.json` |
| Dự án | `content/projects/*.md` (mỗi dự án một file) |
| Tin tức | `content/news/*.md` (mỗi bài một file) |
| Hình ảnh | `public/images/…` |
| Video nền khối Màn hình LED (trang chủ) | `public/videos/led-hero.mp4` – xem `public/videos/README.md` |

### Thêm một dự án mới

1. Tạo thư mục ảnh `public/images/projects/ten-du-an/` và chép ảnh vào (nên dùng `.webp` hoặc `.jpg`, rộng khoảng 1600px).
2. Tạo file `content/projects/ten-du-an.md`:

```markdown
---
title: Thi Công Màn Hình LED P2.5 Indoor Tại Hội Trường ABC
date: '2026-11-01'
location: Hà Đông, Hà Nội
solution: hoi-truong
tags:
  - P2.5
  - Indoor
cover: /images/projects/ten-du-an/1.webp
gallery:
  - /images/projects/ten-du-an/1.webp
  - /images/projects/ten-du-an/2.webp
summary: Mô tả ngắn 1–2 câu, hiển thị khi chia sẻ lên mạng xã hội.
---

Nội dung bài viết, viết bằng Markdown. Dùng `## Tiêu đề` cho tiêu đề mục, `- ` cho danh sách, `**chữ đậm**`.
```

`solution` là một trong: `hoi-truong`, `phong-hop`, `san-khau-su-kien`, `bar-karaoke`, `tiec-cuoi-nha-hang`, `truong-hoc-co-quan`, `the-thao-cong-cong`, `quang-cao-ngoai-troi`, `nha-xuong`.

Tin tức làm tương tự trong `content/news/` và `public/images/news/` (không có `location`, `solution`, `tags`).

### Tiếng Anh và tiếng Trung

Website có 3 ngôn ngữ: tiếng Việt (đường dẫn gốc, ví dụ `/du-an`), tiếng Anh (`/en/du-an`) và tiếng Trung giản thể (`/zh/du-an`).

- Bản dịch nội dung nằm trong `content/en/` và `content/zh/`, cùng tên và cùng cấu trúc với file tiếng Việt. Khi sửa một file tiếng Việt (ví dụ `content/solutions.json`), hãy sửa luôn file tương ứng ở hai thư mục này. Nếu thiếu file dịch, trang sẽ tạm hiện tiếng Việt.
- Dự án và tin tức: chỉ dịch tiêu đề, tóm tắt (và địa điểm) trong `content/en/projects.json`, `content/en/news.json` (tương tự cho `zh`), theo tên file của bài. Thân bài giữ tiếng Việt, kèm dòng ghi chú. Khi thêm bài mới, thêm một mục vào hai file này.
- Chữ giao diện (menu, nút, form): `src/i18n/ui.ts`. Chữ cố định của từng trang (tiêu đề, khẩu hiệu): `src/i18n/copy.ts`.

Trong các file JSON, cặp dấu `**…**` trong đoạn giới thiệu dùng để nhấn mạnh chữ (hiển thị đậm, màu đen trên nền chữ xám).

---

## 6. Cấu trúc kỹ thuật

```
content/            Nội dung (JSON + Markdown)
public/images/      Hình ảnh (đã nén WebP)
src/app/[lang]/     Các trang (App Router), một bộ cho mỗi ngôn ngữ vi / en / zh
  giai-phap/        Trang giải pháp
  dich-vu/          Trang dịch vụ
  san-pham/         Danh mục sản phẩm
  du-an/            Dự án
  tin-tuc/          Tin tức
  doi-tac/          Đối tác
  gioi-thieu/       Giới thiệu
  lien-he/          Liên hệ + form
  api/contact/      API gửi email qua Resend
src/components/     Thành phần giao diện dùng chung
src/lib/            Đọc nội dung, kiểm tra form
src/i18n/           Ngôn ngữ: cấu hình, chữ giao diện, chữ từng trang
src/proxy.ts        Đường dẫn tiếng Việt không tiền tố + chuyển hướng đường dẫn cũ
src/app/globals.css Hệ thống thiết kế (màu, chữ, khoảng cách, thành phần)
```

Giao diện: chữ SF Pro (trên thiết bị Apple), Inter (thiết bị khác); màu nhấn đỏ thương hiệu `#C8321A` (đạt chuẩn tương phản WCAG AA);
khối nền sáng / tối xen kẽ; hiệu ứng xuất hiện khi cuộn bằng CSS thuần, tự tắt khi người dùng bật "giảm chuyển động".
