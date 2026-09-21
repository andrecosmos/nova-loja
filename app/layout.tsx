import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { CarrinhoProvider } from "@/context/CarrinhoContext"
import { SessionProvider } from "next-auth/react" // <--- IMPORTANTE
import Navbar from "@/components/Navbar" // <--- IMPORTANTE

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Minha Loja",
  description: "E-commerce fullstack",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <CarrinhoProvider>
            <Navbar /> {/* A barra agora é global e fixa no topo de todo o site */}
            {children}
          </CarrinhoProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
