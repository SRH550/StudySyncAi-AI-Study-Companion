import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            StudySync <span className="gradient-text">AI</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Built with AI to help you learn smarter, not harder.
        </p>
      </div>
    </footer>
  )
}
