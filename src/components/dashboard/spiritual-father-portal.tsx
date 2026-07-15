"use client";

import { useEffect, useState } from "react";

import { SpiritualFatherLogin } from "@/components/auth/spiritual-father-login";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export function SpiritualFatherPortal() {
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [isCheckingSession, setIsCheckingSession] =
    useState(true);

  useEffect(() => {
    const persistentSession =
      window.localStorage.getItem(
        "spiritual-father-persistent-session",
      );

    const temporarySession =
      window.sessionStorage.getItem(
        "spiritual-father-session",
      );

    setIsAuthenticated(
      persistentSession === "authenticated" ||
        temporarySession === "authenticated",
    );

    setIsCheckingSession(false);
  }, []);

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fc]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e5dccb] border-t-[#b99645]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <SpiritualFatherLogin
        onLogin={() => setIsAuthenticated(true)}
      />
    );
  }

  return <DashboardShell />;
}
