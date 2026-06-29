import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "sonner"
import { cookies } from "next/headers"
import "./globals.css"
import { LanguageProvider } from "@/lib/i18n/LanguageProvider"
import { getLangFromCookies } from "@/lib/i18n/server"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Kshatriya Mewada Rajput Parivar",
  description: "Preserving heritage, uniting families through verified matrimonial matches.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const lang = getLangFromCookies(cookieStore.get?.("lang")?.value ?? null)

  return (
    <html lang={lang} className={`${inter.variable} ${playfair.variable} ${lang === "hi" ? "lang-hi" : ""}`}>
      <body className="font-sans">
        <LanguageProvider initialLang={lang}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#FFFDF7",
                border: "1px solid #C5A55A",
                color: "#800020",
              },
            }}
          />
        </LanguageProvider>
      </body>
    </html>
  )
}