"use client"

import { useState, useEffect } from "react"
import { User, Mail, Calendar, LogOut, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"

/* eslint-disable @typescript-eslint/no-explicit-any */

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
      </div>

      <div className="glass overflow-hidden rounded-2xl border border-border/50">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" />

        <div className="px-8 pb-8">
          {/* Avatar - overlapping banner */}
          <div className="-mt-16 mb-6 flex justify-between items-end">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-4xl font-bold text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="destructive"
              className="gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label className="text-muted-foreground">Full Name</Label>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 px-4 py-3">
                <User className="h-5 w-5 text-primary" />
                <span className="font-medium">{user.name}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-muted-foreground">Email Address</Label>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 px-4 py-3">
                <Mail className="h-5 w-5 text-accent" />
                <span className="font-medium">{user.email}</span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-muted-foreground">Member Since</Label>
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 px-4 py-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">February 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
