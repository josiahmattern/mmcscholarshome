import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MMC Scholars Home",
  description: "Created by the MMC Digital Lab Web Dev Team",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="cmyk">
      <head>
        <link rel="icon" href="/images/favicon.ico" sizes="16x16" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
