import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/common/context/theme-context";
import { UserProvider } from "@/src/common/context/user-context";
import { DialogProvider } from "@/src/common/context/dialog-context";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Report - LAZ Persis",
  description: "Sistem Informasi Internal & Pelaporan Terpadu LAZ Persis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("scroll-smooth", "dark", inter.variable, "font-sans", geist.variable)} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.addEventListener('pageshow', function(event) {
                  if (event.persisted || (window.performance && window.performance.navigation && window.performance.navigation.type === 2)) {
                    window.location.reload();
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-on-surface transition-colors duration-200">
        <UserProvider>
          <ThemeProvider>
            <Toaster>
              <DialogProvider>
                {children}
              </DialogProvider>
            </Toaster>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}

