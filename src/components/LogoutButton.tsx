"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
  iconOnly?: boolean;
}

export function LogoutButton({ className, iconOnly = false }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      aria-label={iconOnly ? "Log out" : undefined}
      className={
        className ??
        (iconOnly
          ? "grid size-9 shrink-0 place-items-center rounded-lg text-paper/55 hover:bg-paper/10 hover:text-paper"
          : "inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-ink/65 hover:bg-amber-tint hover:text-ink")
      }
    >
      <LogOut aria-hidden="true" size={17} strokeWidth={1.8} />
      {iconOnly ? <span className="sr-only">Log out</span> : "Log out"}
    </button>
  );
}
