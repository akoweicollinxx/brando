"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
  Sparkles,
  FolderOpen,
  Rocket,
  Globe,
  Settings,
  Zap,
  Lock,
  CreditCard,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { has, isLoaded } = useAuth();

  const isPremium = isLoaded ? (has?.({ plan: "premium" }) ?? false) : false;

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  function handleLaunchClick(e: React.MouseEvent) {
    if (!isPremium) {
      e.preventDefault();
      router.push("/dashboard/billing");
    }
  }

  return (
    <aside className="flex flex-col w-56 min-h-screen bg-[#0a0a0a] text-white shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/8">
        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 text-black" />
        </div>
        <div>
          <span className="text-base font-bold tracking-tight">brando</span>
          <span className="block text-[10px] text-white/30 leading-none mt-0.5">AI Brand Builder</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">

        <NavItem href="/dashboard" label="Generate" icon={Sparkles} active={isActive("/dashboard", true)} />
        <NavItem href="/dashboard/projects" label="My Brands" icon={FolderOpen} active={isActive("/dashboard/projects")} />

        {/* Launch Mode — locked for free users */}
        <Link
          href="/dashboard/launch"
          onClick={handleLaunchClick}
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isActive("/dashboard/launch")
              ? "bg-white text-black"
              : "text-white/55 hover:text-white hover:bg-white/8"
          }`}
        >
          <Rocket className="w-4 h-4 shrink-0" />
          <span className="flex-1">Launch Mode</span>
          {!isPremium && isLoaded && (
            <Lock className="w-3 h-3 text-white/30 shrink-0" />
          )}
        </Link>

        <NavItem href="/showcase" label="Showcase" icon={Globe} active={isActive("/showcase")} />
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 border-t border-white/8 pt-4 space-y-0.5">

        {/* Billing / plan badge */}
        <Link
          href="/dashboard/billing"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isActive("/dashboard/billing")
              ? "bg-white text-black"
              : "text-white/55 hover:text-white hover:bg-white/8"
          }`}
        >
          <CreditCard className="w-4 h-4 shrink-0" />
          <span className="flex-1">Billing</span>
          {isLoaded && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isPremium
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/30"
                : "bg-white/10 text-white/40"
            }`}>
              {isPremium ? "PRO" : "FREE"}
            </span>
          )}
        </Link>

        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isActive("/dashboard/settings")
              ? "bg-white text-black"
              : "text-white/55 hover:text-white hover:bg-white/8"
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

function NavItem({ href, label, icon: Icon, active }: {
  href: string; label: string; icon: React.ElementType; active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active ? "bg-white text-black" : "text-white/55 hover:text-white hover:bg-white/8"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}
