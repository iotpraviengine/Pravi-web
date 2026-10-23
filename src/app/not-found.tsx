import Link from "next/link";
import { MoreLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="hero section" style={{ minHeight: "60vh" }}>
      <div className="container">
        <span className="eyebrow">Lỗi 404</span>
        <h1 className="display">Không tìm thấy trang.</h1>
        <p className="subhead">Trang bạn tìm có thể đã được chuyển đi trong lần nâng cấp website. Hãy thử một trong những trang dưới đây.</p>
        <div className="actions center">
          <Link href="/" className="btn btn-primary">
            Về trang chủ
          </Link>
          <Link href="/lien-he" className="btn btn-secondary">
            Liên hệ SKV
          </Link>
        </div>
        <div className="tile-links" style={{ marginTop: 40 }}>
          <MoreLink href="/giai-phap">Giải pháp</MoreLink>
          <MoreLink href="/san-pham">Sản phẩm</MoreLink>
          <MoreLink href="/du-an">Dự án</MoreLink>
          <MoreLink href="/tin-tuc">Tin tức</MoreLink>
        </div>
      </div>
    </section>
  );
}
