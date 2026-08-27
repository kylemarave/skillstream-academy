import Link from "next/link";

const footerLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Contact Support" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-ink/10 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <p className="text-sm font-medium text-ink">Skillstream Academy</p>

        <nav className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-ink/60 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-ink/50">© 2026 Skillstream Academy</p>
      </div>
    </footer>
  );
}
