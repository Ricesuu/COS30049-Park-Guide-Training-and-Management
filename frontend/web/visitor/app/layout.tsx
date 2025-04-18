import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Park Guide Visitor Site",
  description: "Welcome to our park!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
