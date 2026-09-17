"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles, FolderOpen, Rocket, Globe, Settings,
  Zap, Lock, Globe2, Users, FileText,
  TrendingUp, Mail, X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  comingSoon?: boolean;
};

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Create",
    items: [
      { href: "/dashboard",          label: "Generate",       icon: Sparkles,  exact: true  },
      { href: "/dashboard/projects", label: "My Brands",      icon: FolderOpen                },
    ],
  },
  {
    label: "Launch",
    items: [
      { href: "/dashboard/landing-pages", label: "Landing Pages", icon: Globe2                     },
      { href: "/dashboard/launch",        label: "Launch Mode",   icon: Rocket, comingSoon: true },
    ],
  },
  {
    label: "Grow",
    items: [
      { href: "/dashboard/leads",   label: "Leads",    icon: Users    },
      { href: "/dashboard/email",   label: "Email",    icon: Mail     },
      { href: "/dashboard/content", label: "Content",  icon: FileText },
    ],
  },
  {
    label: "Analyze",
    items: [
      { href: "/dashboard/traction", label: "Traction", icon: TrendingUp },
      { href: "/showcase",           label: "Showcase", icon: Globe      },
    ],
  },
];

export default function Sidebar({
  open = false,
  onClose,
}: {
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function handleNavClick() {
    onClose?.();
  }

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 md:w-56 min-h-screen bg-[#0a0a0a] text-white shrink-0 overflow-y-auto transform transition-transform duration-200 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/8 shrink-0">
        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-black" />
        </div>
        <div className="flex-1">
          <span className="text-base font-bold tracking-tight">brando</span>
          <span className="block text-[10px] text-white/30 leading-none mt-0.5">AI Brand Builder</span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 -mr-1.5 text-white/40 hover:text-white transition"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <p className="px-3 mb-1 text-[10px] font-semibold text-white/25 uppercase tracking-widest">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon, exact, comingSoon }) => {
                const active = isActive(href, exact);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={handleNavClick}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-white text-black"
                        : "text-white/55 hover:text-white hover:bg-white/8"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{label}</span>
                    {comingSoon && <Lock className="w-3 h-3 text-white/25 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 border-t border-white/8 pt-4 space-y-0.5 shrink-0">
        <Link
          href="/dashboard/settings"
          onClick={handleNavClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isActive("/dashboard/settings") ? "bg-white text-black" : "text-white/55 hover:text-white hover:bg-white/8"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </Link>

        <div className="flex items-center gap-3 px-3 py-2">
          <ThemeToggle invert />
          <span className="text-xs text-white/35">Toggle theme</span>
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5">
          <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
          <span className="text-sm text-white/45 truncate">Account</span>
        </div>
      </div>
    </aside>
  );
}
