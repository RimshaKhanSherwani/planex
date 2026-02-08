import type { Metadata } from "next";
import "@/styles/global.css";
import JotaiProvider from "@/components/providers/JotaiProvider";
import AntdProvider from "@/components/providers/AntdProvider";

export const metadata: Metadata = {
  title: "PlanEx - Weekly Dashboard",
  description: "Track your habits and tasks with a powerful weekly planning dashboard. Designed for productivity and focus.",
  keywords: ["weekly planner", "habit tracker", "task manager", "productivity", "goal tracking"],
  authors: [{ name: "PlanEx Team" }],
  openGraph: {
    title: "PlanEx - Weekly Dashboard",
    description: "Track your habits and tasks with a powerful weekly planning dashboard",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('planex-theme');
                  if (theme) {
                    theme = JSON.parse(theme);
                    document.documentElement.className = theme;
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <JotaiProvider>
          <AntdProvider>
            {children}
          </AntdProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
