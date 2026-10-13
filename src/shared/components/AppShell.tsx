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
        <div className="flex-1 mt-16">{children}</div>
      </div>
    </div>
  );
}
