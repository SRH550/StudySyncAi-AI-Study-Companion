"use client"

import { MessageSquare, FileText, HelpCircle, TrendingUp, Shield, Clock } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "AI Chat Assistant",
    description: "Chat directly with your notes. Ask questions, get explanations, and deep-dive into any topic with our intelligent assistant.",
    color: "text-primary" as const,
    bgColor: "bg-primary/10" as const,
  },
  {
    icon: FileText,
    title: "Smart Summaries",
    description: "Upload your notes and get concise, intelligent summaries that capture the key concepts and important details.",
    color: "text-accent" as const,
    bgColor: "bg-accent/10" as const,
  },
  {
    icon: HelpCircle,
    title: "Quiz Generator",
    description: "Automatically generate customized quizzes from your study material to test your understanding and retention.",
    color: "text-primary" as const,
    bgColor: "bg-primary/10" as const,
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your study streaks, quiz scores, and overall performance with beautiful analytics dashboards.",
    color: "text-accent" as const,
    bgColor: "bg-accent/10" as const,
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your study materials are encrypted and stored securely. We never share your data with third parties.",
    color: "text-primary" as const,
    bgColor: "bg-primary/10" as const,
  },
  {
    icon: Clock,
    title: "Study Anytime",
    description: "Access your notes, chats, and quizzes from any device. Your study companion is available 24/7.",
    color: "text-accent" as const,
    bgColor: "bg-accent/10" as const,
  },
]

export function Features() {
  return (
    <section className="relative px-6 py-32 bg-secondary/50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-64 w-64 animate-pulse rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 animate-pulse rounded-full bg-accent/5 blur-3xl" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mb-4 text-balance text-4xl font-bold text-foreground md:text-5xl">
            Everything you need to{" "}
            <span className="gradient-text">study smarter</span>
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
            Powerful AI tools designed to transform how you learn, review, and retain information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-xl border border-border bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity group-hover:opacity-100 rounded-t-xl" />

              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
