import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-full px-8 py-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-white/45 mt-1">Manage your account and subscription.</p>
      </div>

      <div className="space-y-4">
        {/* Account */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
          <div className="flex items-center gap-4">
            <UserButton appearance={{ elements: { avatarBox: "w-12 h-12" } }} />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Your Account</p>
              <p className="text-xs text-gray-500 dark:text-white/40">Manage your profile, email, and password via Clerk.</p>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Subscription</h2>
          <p className="text-sm text-gray-500 dark:text-white/45 mb-4">
            You are currently on the <strong className="text-gray-900 dark:text-white">Free</strong> plan.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition"
          >
            Upgrade plan <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Usage */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-1">Usage</h2>
          <p className="text-sm text-gray-500 dark:text-white/45 mb-3">Brand generations used this month.</p>
          <div className="h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-black dark:bg-white rounded-full" />
          </div>
          <p className="text-xs text-gray-400 dark:text-white/30 mt-2">1 of 2 free generations used</p>
        </div>
      </div>
    </div>
  );
}
