"use client"

import {
  FileText,
  MessageSquare,
  HelpCircle,
  Flame,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [statsData, setStatsData] = useState<any>({
    notesCount: 0,
    chatCount: 0,
    quizScore: 0,
    studyStreak: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    async function fetchData() {
      try {
        const api = (await import("@/lib/api")).default

        const statsRes = await api.get("/dashboard/stats")
        setStatsData(statsRes.data)

        const activityRes = await api.get("/dashboard/activity")
        setRecentActivity(activityRes.data)
      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      }
    }
    fetchData()
  }, [])

  const stats = [
    {
      label: "Notes Uploaded",
      value: statsData.notesCount,
      change: "+3 this week",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      label: "AI Chats",
      value: statsData.chatCount,
      change: "+12 this week",
      icon: MessageSquare,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
    {
      label: "Quiz Score",
      value: `${statsData.quizScore}%`,
      change: "+5% improvement",
      icon: HelpCircle,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      label: "Study Streak",
      value: statsData.studyStreak,
      change: "days in a row",
      icon: Flame,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note': return FileText;
      case 'quiz': return HelpCircle;
      case 'chat': return MessageSquare;
      default: return Clock;
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="gradient-text">{user ? user.name.split(' ')[0] : "Student"}</span>
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here is an overview of your study progress.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`group glass relative overflow-hidden rounded-xl border ${stat.borderColor} p-6 transition-all duration-300 hover:-translate-y-0.5 hover:glow-sm`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-accent" />
                  {stat.change}
                </p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass rounded-xl border border-border/50 p-6 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <span className="text-xs text-muted-foreground">Last 5 items</span>
          </div>
          <div className="flex flex-col gap-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No recent activity yet.</p>
            ) : (
              recentActivity.map((activity, i) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-lg bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}:{" "}
                        <span className="text-muted-foreground">{activity.item}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(activity.time).toLocaleDateString()}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="glass rounded-xl border border-border/50 p-6">
          <h2 className="mb-5 text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/notes">
              <Button
                variant="outline"
                className="group h-12 w-full justify-start gap-3 border-border/50 text-foreground hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                Upload Notes
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/dashboard/chat">
              <Button
                variant="outline"
                className="group h-12 w-full justify-start gap-3 border-border/50 text-foreground hover:border-accent/30 hover:bg-accent/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                  <MessageSquare className="h-4 w-4 text-accent" />
                </div>
                Start AI Chat
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/dashboard/quiz">
              <Button
                variant="outline"
                className="group h-12 w-full justify-start gap-3 border-border/50 text-foreground hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <HelpCircle className="h-4 w-4 text-primary" />
                </div>
                Take a Quiz
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
