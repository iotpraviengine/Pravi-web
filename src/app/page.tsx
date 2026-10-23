import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CtaBand, MoreLink, NewsCard, ProjectCard, SectionHead } from "@/components/ui";
import { brands, getNews, getProjects, services, siteInfo, solutions } from "@/lib/content";

export default function HomePage() {
  // The wedding solution shares the hero photo, so the home grid features the others.
  const featuredSolutions = ["hoi-truong", "phong-hop", "san-khau-su-kien", "bar-karaoke", "truong-hoc-co-quan", "the-thao-cong-cong"]
    .map((slug) => solutions.find((s) => s.slug === slug)!)
    .filter(Boolean);
  // Hand-picked: projects whose cover photo is a clean, finished shot.
  const projects = [
    "skv-thi-cong-man-hinh-led-co-lon-p2-5-indoor-tai-hoc-vien-chinh-sach",
    "man-hinh-led-p2-5-indoor-tai-viet-yen-bac-giang",
    "skv-thi-cong-100m2-man-hinh-led-p2-indoor-tai-trung-tam-van-hoa-tinh-ninh-binh",
    "thi-cong-man-hinh-led-p2-5-indoor-tai-taki-academy-ha-noi",
    "skv-thi-cong-man-hinh-led-p3-91-indoor-tai-nha-thi-dau-huyen-thanh-tri",
    "skv-ban-giao-du-an-lap-dat-man-hinh-led-tivi-ghe-cho-tai-ben-xe-my-dinh",
  ]
    .map((slug) => getProjects().find((p) => p.slug === slug))
    .filter((p) => p !== undefined);
  const news = getNews().slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <span className="hero-tag reveal">
            <b>Mới</b> Nhà phân phối độc quyền BOE MLED tại Việt Nam
          </span>
          <h1 className="display reveal">
            Hiển thị & ánh sáng
            <br />
            cho mọi không gian.
          </h1>
          <p className="subhead reveal" data-delay="1">
            Giải pháp màn hình LED, đèn sân khấu và hiệu ứng – tư vấn, thi công và bảo trì trọn gói trên toàn quốc.
          </p>
          <div className="actions center reveal" data-delay="2">
            <Link href="/giai-phap" className="btn btn-primary">
              Khám phá giải pháp
            </Link>
            <Link href="/lien-he" className="btn btn-secondary">
              Nhận tư vấn miễn phí
            </Link>
          </div>
        </div>
        <div className="hero-media container-wide" style={{ paddingInline: 0 }}>
          <Image
            src="/images/home/hero.webp"
            alt="Hội trường Trung tâm Văn hóa tỉnh Điện Biên với màn hình LED và hệ thống đèn sân khấu do SKV thi công"
            fill
            priority
            sizes="100vw"
          />
        </div>
      </section>

      {/* BOE promo */}
      <section className="tile tile-full theme-dark" aria-labelledby="boe-title">
        <div className="tile-copy reveal">
          <span className="eyebrow">BOE MLED</span>
          <h2 id="boe-title" className="headline">
            Công nghệ hiển thị hàng đầu thế giới.
            <br />
            Nay chính hãng tại Việt Nam.
          </h2>
          <p className="subhead" style={{ color: "var(--text-2)", marginTop: 12 }}>
            SKV Lighting là nhà phân phối độc quyền BOE MLED tại Việt Nam.
          </p>
          <div className="tile-links">
            <MoreLink href="/tin-tuc/skv-chinh-thuc-tro-thanh-nha-phan-phoi-doc-quyen-boe-tai-viet-nam">Tìm hiểu thêm</MoreLink>
            <MoreLink href="/san-pham#man-hinh-led">Xem sản phẩm</MoreLink>
          </div>
        </div>
        <div className="tile-media reveal" data-delay="1">
          <Image
            src="/images/home/boe.webp"
            alt="Đội ngũ SKV Lighting tại gian hàng BOE, triển lãm InfoComm Asia 2026"
            fill
            sizes="(min-width: 1100px) 1040px, 92vw"
          />
        </div>
      </section>

      {/* NovaStar promo */}
      <section className="tile tile-full theme-alt" aria-labelledby="nova-title">
        <div className="tile-copy reveal">
          <span className="eyebrow">NovaStar</span>
          <h2 id="nova-title" className="headline">
            Bộ não của mọi màn hình LED.
          </h2>
          <p className="subhead" style={{ color: "var(--text-2)", marginTop: 12 }}>
            Bộ xử lý hình ảnh, card điều khiển chính hãng – SKV là nhà phân phối NovaStar tại Việt Nam.
          </p>
          <div className="tile-links">
            <MoreLink href="/tin-tuc/skv-lighting-chinh-thuc-tro-thanh-nha-phan-phoi-novastar-chinh-hang-tai-viet-nam">
              Tìm hiểu thêm
            </MoreLink>
            <MoreLink href="/san-pham#xu-ly-hinh-anh">Xem bộ xử lý</MoreLink>
          </div>
        </div>
        <div className="tile-media reveal" data-delay="1">
          <Image
            src="/images/home/booth.webp"
            alt="Gian hàng SKV Lighting trưng bày thiết bị NovaStar và PixelHue tại triển lãm NPSE Show 2026"
            fill
            sizes="(min-width: 1100px) 1040px, 92vw"
          />
        </div>
      </section>

      {/* Solution tiles */}
      <section aria-labelledby="solutions-title">
        <h2 id="solutions-title" className="sr-only">
          Giải pháp theo không gian
        </h2>
        <div className="tile-grid">
          {featuredSolutions.map((s, i) => {
            const dark = i % 4 === 0 || i % 4 === 3;
            return (
              <article key={s.slug} className={`tile ${dark ? "theme-dark" : "theme-alt"}`}>
                <div className="tile-copy reveal">
                  <h3 className="title">{s.short}</h3>
                  <p className="subhead" style={{ marginTop: 8 }}>
                    {s.tileHeadline}
                  </p>
                  <div className="tile-links">
                    <MoreLink href={`/giai-phap/${s.slug}`}>Tìm hiểu thêm</MoreLink>
                    <MoreLink href={`/lien-he?giai-phap=${s.slug}`}>Nhận tư vấn</MoreLink>
                  </div>
                </div>
                <div className="tile-media reveal" data-delay="1">
                  <Image src={s.hero} alt={s.name} fill sizes="(min-width: 834px) 46vw, 92vw" />
                </div>
              </article>
            );
          })}
        </div>
        <p className="center" style={{ padding: "20px 0 8px", fontSize: 19 }}>
          <MoreLink href="/giai-phap">Xem tất cả {solutions.length} giải pháp</MoreLink>
        </p>
      </section>

      {/* Stats */}
      <section className="section">
        <div className="container">
          <SectionHead
            center
            title="Hơn 10 năm thắp sáng những sân khấu Việt."
            subhead="SKV – tinh hoa Sân Khấu Việt. Uy tín, cam kết và tận tâm trong từng công trình."
          />
          <div className="stats center">
            {siteInfo.stats.map((s, i) => (
              <div key={s.label} className="reveal" data-delay={String(i)}>
                <div className="stat-value">{s.value}</div>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section theme-alt" aria-labelledby="projects-title">
        <div className="container">
          <div className="section-head reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 16 }}>
            <div>
              <span className="eyebrow">Dự án tiêu biểu</span>
              <h2 id="projects-title" className="headline">
                Được tin chọn trên khắp cả nước.
              </h2>
            </div>
            <MoreLink href="/du-an">Xem tất cả dự án</MoreLink>
          </div>
          <div className="grid grid-3">
            {projects.map((p, i) => (
              <div key={p.slug} className="reveal" data-delay={String(i % 3)}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section" aria-labelledby="services-title">
        <div className="container">
          <SectionHead
            eyebrow="Dịch vụ"
            title="Từ bản vẽ đến buổi khai trương."
            subhead="Một đầu mối cho toàn bộ vòng đời hệ thống hiển thị và ánh sáng của bạn."
          />
          <div className="grid grid-4">
            {services.map((s, i) => (
              <Link key={s.slug} href={`/dich-vu/${s.slug}`} className="card reveal" data-delay={String(i)}>
                <span className="card-icon">
                  <Icon name={s.icon} size={32} />
                </span>
                <h3>{s.name}</h3>
                <p>{s.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section theme-dark" aria-labelledby="brands-title">
        <div className="container">
          <SectionHead
            center
            eyebrow="Đối tác & thương hiệu"
            title="Chính hãng. Từ những thương hiệu dẫn đầu."
            subhead="Sản phẩm nhập khẩu chính ngạch, nguồn gốc rõ ràng, bảo hành theo chính sách nhà sản xuất."
          />
          <div className="brand-grid reveal">
            {brands.map((b) => (
              <div key={b.name} className="brand-cell">
                {b.name}
              </div>
            ))}
          </div>
          <p className="center" style={{ marginTop: 32, fontSize: 19 }}>
            <MoreLink href="/doi-tac">Tìm hiểu về đối tác</MoreLink>
          </p>
        </div>
      </section>

      {/* News */}
      <section className="section" aria-labelledby="news-title">
        <div className="container">
          <div className="section-head reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 16 }}>
            <div>
              <span className="eyebrow">Tin tức</span>
              <h2 id="news-title" className="headline">
                Có gì mới tại SKV.
              </h2>
            </div>
            <MoreLink href="/tin-tuc">Xem tất cả tin tức</MoreLink>
          </div>
          <div className="grid grid-3">
            {news.map((n, i) => (
              <div key={n.slug} className="reveal" data-delay={String(i)}>
                <NewsCard post={n} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
