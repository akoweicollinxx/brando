import { auth } from "@clerk/nextjs/server";

export async function hasPremium(): Promise<boolean> {
  try {
    const { has } = await auth();
    return has({ plan: "premium" });
  } catch {
    return false;
  }
}
