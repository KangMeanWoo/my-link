import { Geist, Geist_Mono, Oxanium } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import QueryProvider from "@/components/providers/query-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const oxanium = Oxanium({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "MyLink - 모든 링크를 한 곳에",
    template: "%s | MyLink"
  },
  description: "개발자, 크리에이터를 위한 심플하고 강력한 링크 인 바이오 서비스. 단 1초 만에 나만의 랜딩 페이지를 만들어보세요.",
  keywords: ["링크인바이오", "마이링크", "Linktree alternative", "포트폴리오", "개발자 링크", "디지털 명함"],
  authors: [{ name: "MyLink Team" }],
  creator: "MyLink",
  publisher: "MyLink",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "MyLink - 모든 링크를 한 곳에",
    description: "나만의 링크를 한 곳에 모으고 통계를 확인하세요.",
    url: "https://mylink.app",
    siteName: "MyLink",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MyLink - 모든 링크를 한 곳에",
    description: "나만의 링크를 한 곳에 모으고 통계를 확인하세요.",
    creator: "@mylink",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", oxanium.variable)}
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster position="top-center" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
