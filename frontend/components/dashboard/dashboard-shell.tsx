"use client"

import { useState, useEffect } from "react"
import { SidebarNav } from "./sidebar-nav"
import { DashboardHeader } from "./dashboard-header"
import { useRouter } from "next/navigation"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center p-6">Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
