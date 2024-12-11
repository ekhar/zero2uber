import React from "react";
import "./globals.css";

export const metadata = {
  title: "Simple Uber-like App",
  description: "A minimal Next.js frontend for a simplified Uber flow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <header style={{ background: "#333", color: "#fff", padding: "1rem" }}>
          <nav>
            <a
              href="/"
              style={{
                marginRight: "1rem",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              Home
            </a>
            <a href="/driver" style={{ color: "#fff", textDecoration: "none" }}>
              Driver
            </a>
          </nav>
        </header>
        <main style={{ padding: "1rem" }}>{children}</main>
      </body>
    </html>
  );
}
