import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";
import "./aurel.css";

export const metadata: Metadata = {
  title: "Aurel — Finance Automation",
  description:
    "Aurel runs the calculations, checks the logic, and flags the exceptions — so your team spends time on judgment, not arithmetic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders> 
      </body>
    </html>
  );
}
