import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="relative px-6 py-32">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-12 text-center shadow-sm md:p-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Ready to transform your study game?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-pretty text-muted-foreground">
            Join thousands of students who are already studying smarter with AI-powered tools.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="group h-13 gap-2 bg-primary px-10 text-base font-semibold text-white hover:bg-primary/90 shadow-md"
            >
              Start Studying Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
