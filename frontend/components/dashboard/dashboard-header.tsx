"use client"

import { useState, useEffect } from "react"
import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface DashboardHeaderProps {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <header className="flex items-center justify-between border-b border-border/50 bg-background/80 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes, quizzes..."
            className="h-10 w-72 border-border/50 bg-secondary/50 pl-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/profile">
            <Avatar className="h-9 w-9 border border-border/50 transition-transform hover:scale-105 cursor-pointer">
              <AvatarFallback className="bg-primary/20 text-sm font-semibold text-primary">
                {user ? user.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">{user ? user.name : "User"}</p>
            <p className="text-xs text-muted-foreground">{user ? user.email : "Student"}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
