import Link from "next/link";

interface SidebarLink {
  href: string;
  label: string;
}

interface SidebarProps {
  title: string;
  links: SidebarLink[];
  currentPath?: string;
}

export default function Sidebar({ title, links, currentPath }: SidebarProps) {
  return (
    <aside className="w-48 shrink-0">
      <div className="sticky top-16">
        <div className="bg-gray-50 border border-gray-200 rounded">
          <div className="bg-[#04aa6d] text-white text-xs font-semibold px-3 py-2 rounded-t">
            {title}
          </div>
          <nav className="py-1">
            {links.map((link) => {
              const active = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-[#04aa6d] text-white font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
