import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "UP GWA Calculator",
  description: "Calculate your General Weighted Average (GWA) based on the UP grading system.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background font-sans antialiased p-0 m-0 w-full ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
