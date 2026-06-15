import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/portfolios", label: "Khám phá" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/contact", label: "Liên hệ" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Đăng nhập" },
];

const socialLinks = [
  {
    href: "https://github.com",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
      </svg>
    ),
  },
  {
    href: "https://behance.net",
    label: "Behance",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029H23.726zm-7.714-3.766c-.073-1.521-1.032-2.394-2.275-2.394-1.361 0-2.275.882-2.475 2.394h4.75zM9.662 14c.308-.585.413-1.291.374-2.024-.046-.906-.369-1.697-.921-2.275-.512-.537-1.205-.894-2.054-1.059 1.186-.433 1.956-1.291 1.956-2.553 0-2.21-1.706-3.089-4.178-3.089H0v14h5.147c3.099 0 4.9-1.302 4.9-3.547 0-.204-.013-.399-.044-.59A4.16 4.16 0 0 0 9.662 14zm-6.85-7.484h2.452c1.148 0 1.928.433 1.928 1.472 0 .876-.623 1.491-1.928 1.491H2.812V6.516zm0 8.968V11.5h2.618c1.333 0 2.069.566 2.069 1.972 0 1.359-.736 2.012-2.069 2.012H2.812z" />
      </svg>
    ),
  },
  {
    href: "https://instagram.com",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      {/* Main footer content */}
      <div className="app-container py-10">
        <div className="grid gap-10 sm:grid-cols-[2fr_1fr]">
          {/* Brand column */}
          <div className="grid gap-5">
            {/* Logo with real image */}
            <Link href="/" className="flex w-fit items-center gap-3 group">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-md transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Artfolio logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                Artfolio
              </span>
            </Link>

            {/* Description */}
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Nền tảng portfolio sáng tạo dành cho{" "}
              <span className="font-medium text-foreground">designer</span>,{" "}
              <span className="font-medium text-foreground">artist</span> và{" "}
              <span className="font-medium text-foreground">photographer</span>.
              Chia sẻ tác phẩm — kết nối cộng đồng.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted transition hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            <p className="text-xs text-muted">
              INT1334 · CreativePortfolio · {year}
            </p>
          </div>

          {/* Navigation column */}
          <nav className="grid h-fit gap-2">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-muted">
              Điều hướng
            </p>
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-foreground hover:translate-x-0.5"
              >
                <span className="h-px w-3 bg-muted/50 transition group-hover:bg-primary" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="app-container flex flex-col gap-1 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Artfolio. Dự án học tập.</span>
          <span className="flex items-center gap-1.5">
            <span>Next.js</span>
            <span className="text-muted/40">·</span>
            <span>Tailwind CSS</span>
            <span className="text-muted/40">·</span>
            <span>TypeScript</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
