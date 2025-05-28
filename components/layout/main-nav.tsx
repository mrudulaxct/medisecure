import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  // TODO: Get user role from auth context
  const userRole = "doctor" // This will be dynamic

  const navigationLinks = {
    admin: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/users", label: "Users" },
      { href: "/admin/settings", label: "Settings" },
    ],
    doctor: [
      { href: "/doctor", label: "Dashboard" },
      { href: "/doctor/appointments", label: "Appointments" },
      { href: "/doctor/patients", label: "Patients" },
    ],
    patient: [
      { href: "/patient", label: "Dashboard" },
      { href: "/patient/appointments", label: "Appointments" },
      { href: "/patient/records", label: "Medical Records" },
    ],
  }

  const links = navigationLinks[userRole as keyof typeof navigationLinks] || []

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium transition-colors hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
} 