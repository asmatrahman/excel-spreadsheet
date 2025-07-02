import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Excel Spreadsheet",
  description: "A simple spreadsheet application built with React and Next.js",
  authors: [
    {
      name: "Asmat Rahman",
      url: "http://asmatrahman.github.io/",
    },
  ],
  keywords: ["spreadsheet", "excel", "react", "next.js"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
