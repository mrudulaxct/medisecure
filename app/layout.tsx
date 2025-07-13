import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Navigation } from "@/components/layout/navigation"
import { AuthProvider } from "@/components/providers/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MediSecure - Healthcare Management System",
  description: "A secure healthcare management system for hospitals",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <AuthProvider>
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
