"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  iconOnly?: boolean;
}

export function LogoutButton({ iconOnly = false }: LogoutButtonProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        aria-label="Log out"
        className="grid size-11 place-items-center text-muted hover:text-ink"
      >
        <LogOut aria-hidden="true" size={17} strokeWidth={1.8} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-left text-sm text-muted hover:text-ink"
    >
      Log out
    </button>
  );
}
