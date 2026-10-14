"use client";

import { useState } from "react";
import SideNavBar from "./SideNavBar";
import TopNavBar from "./TopNavBar";

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
    <div className="min-h-screen bg-background text-on-surface flex flex-col transition-colors duration-200">
      {/* Sidebar */}
      <SideNavBar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top App Bar */}
        <TopNavBar
          onToggleSidebar={() => setSidebarOpen(true)}
          title={headerTitle}
          badge={headerBadge}
        />

        {/* Content Area */}
        <div className="flex-1 mt-16 flex flex-col justify-between">
          <div className="flex-1">{children}</div>
          <footer className="border-t border-outline-variant/40 py-5 text-center px-4 mt-auto">
            <p className="text-xs text-outline font-medium tracking-wide">
              &copy; 2026 Daily Report LAZ Persis
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
