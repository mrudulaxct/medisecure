import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <UserNav />
        </div>
      </header>
      <main className="container flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
} 