"use client";

import { useState } from "react";
import SideNavBar from "./side-nav-bar";
import TopNavBar from "./top-nav-bar";
import IdleTimeoutProvider from "./idle-timeout-provider";
import { Separator } from "@/components/ui/separator";

interface AppShellProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerBadge?: string;
}

export default function AppShell({
  children,
  headerTitle,
  headerBadge,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <IdleTimeoutProvider>
      <div className="min-h-screen bg-background text-on-surface flex flex-col transition-colors duration-200">
        <SideNavBar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          <TopNavBar
            onToggleSidebar={() => setSidebarOpen(true)}
            title={headerTitle}
            badge={headerBadge}
          />

          <div className="flex-1 mt-16 flex flex-col justify-between">
            <div className="flex-1">{children}</div>
            <footer className="py-5 pb-8 sm:pb-5 text-center px-4 mt-auto flex flex-col gap-4">
              <Separator className="bg-outline-variant/40" />
              <p className="text-xs text-outline font-medium tracking-wide">
                &copy; 2026 Daily Report LAZ Persis
              </p>
            </footer>
          </div>
        </div>
      </div>
    </IdleTimeoutProvider>
  );
}
