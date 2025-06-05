"use client";

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { authRoutes, publicRoutes } from "../routes";

export function useCustomSession() {
  const { data: lieSession, status, update } = useSession();
  const [truthSession, setUpdatedSession] = useState<Session | null>(null);

  const pathname = usePathname();

  // Refresh session on mount and when the tab becomes active so that
  // signOut() executed on the server properly clears client session state.
  useEffect(() => {
    const refresh = () => {
      update().then((s) => {
        setUpdatedSession(s);
      });
    };

    refresh();
    window.addEventListener("visibilitychange", refresh);

    return () => {
      window.removeEventListener("visibilitychange", refresh);
    };
  }, [update]);

  const session =
    publicRoutes.includes(pathname) || authRoutes.includes(pathname)
      ? truthSession
      : lieSession;

  return { session, status, update };
}