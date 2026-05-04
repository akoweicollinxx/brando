import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span className="text-2xl font-bold tracking-tight text-foreground">brando</span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="mt-2 text-gray-500 dark:text-white/45">Turn your idea into a ready-to-launch brand</p>
        </div>

        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border border-gray-200 dark:border-white/8 rounded-2xl p-8 bg-white dark:bg-[#181818]",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition text-gray-700 dark:text-white/70",
                dividerLine: "bg-gray-200 dark:bg-white/10",
                dividerText: "text-gray-400 dark:text-white/30 text-sm",
                formFieldLabel: "text-sm font-medium text-gray-700 dark:text-white/70",
                formFieldInput:
                  "rounded-xl border-gray-200 dark:border-white/10 text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-black dark:focus:ring-white/30",
                formButtonPrimary:
                  "bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black rounded-xl text-sm font-medium transition",
                footerActionLink: "text-black dark:text-white font-medium hover:underline",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
