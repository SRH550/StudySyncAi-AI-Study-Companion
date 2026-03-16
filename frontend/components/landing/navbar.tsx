"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">
            StudySync <span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-secondary">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary text-white hover:bg-primary/90 shadow-sm">
              Get Started
            </Button>
          </Link>
        </div>

        <button
          className="text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border px-6 pb-6 bg-white md:hidden">
          <div className="flex flex-col gap-3 pt-4">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                Login
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileOpen(false)}>
              <Button className="w-full bg-primary text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
