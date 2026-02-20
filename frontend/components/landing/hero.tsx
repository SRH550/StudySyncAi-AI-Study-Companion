"use client"

import Link from "next/link"
import { ArrowRight, BookOpen, Brain, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 animate-pulse rounded-full bg-accent/10 blur-3xl" style={{ animationDelay: "1s" }} />
        <div className="absolute left-1/2 top-1/3 h-64 w-64 animate-pulse rounded-full bg-primary/5 blur-3xl" style={{ animationDelay: "2s" }} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(oklch(0.7 0.18 230 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.18 230 / 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
          <Zap className="h-4 w-4" />
          <span>Powered by Advanced AI</span>
        </div>

        <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight text-foreground md:text-7xl">
          AI-Powered{" "}
          <span className="gradient-text">Study Companion</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Transform your learning with intelligent summaries, AI-driven quizzes, and a personal chat assistant that understands your study material.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button
              size="lg"
              className="group h-13 gap-2 bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90 glow-md"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="h-13 border-border/60 px-8 text-base text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              Login to Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FloatingCard
            icon={<Brain className="h-6 w-6 text-primary" />}
            title="Smart Summaries"
            description="AI extracts key concepts from your notes instantly"
            delay="0s"
          />
          <FloatingCard
            icon={<BookOpen className="h-6 w-6 text-accent" />}
            title="Quiz Generator"
            description="Auto-generate quizzes to test your knowledge"
            delay="0.1s"
          />
          <FloatingCard
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="AI Chat"
            description="Ask questions about your study material"
            delay="0.2s"
          />
        </div>
      </div>
    </section>
  )
}

function FloatingCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay: string
}) {
  return (
    <div
      className="glass group rounded-xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:glow-sm"
      style={{ animationDelay: delay }}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
        {icon}
      </div>
      <h3 className="mb-1 text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
