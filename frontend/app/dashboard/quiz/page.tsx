"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Target, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface Question {
  question: string
  options: string[]
  correctAnswer: string
}

export default function QuizPage() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [loading, setLoading] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const currentQuestion = questions[currentQ]
  const progress = questions.length > 0 ? ((currentQ + (answered ? 1 : 0)) / questions.length) * 100 : 0

  async function startQuiz() {
    if (!topic) return
    setLoading(true)
    try {
      const api = (await import("@/lib/api")).default
      const { data } = await api.post("/ai/quiz", { topic, difficulty })

      setQuestions(data.quiz)
      setQuizStarted(true)
      setScore(0)
      setCurrentQ(0)
      setFinished(false)
      setAnswered(false)
      setSelected(null)
    } catch (error) {
      console.error("Failed to generate quiz", error)
      alert("Failed to generate quiz. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(index: number) {
    if (answered) return
    setSelected(index)
  }

  function handleCheck() {
    if (selected === null) return
    setAnswered(true)

    const selectedOptionText = currentQuestion.options[selected]
    if (selectedOptionText === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }
  }

  async function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      const finalScore = score
      setFinished(true)
      saveResult(finalScore)
    }
  }

  async function saveResult(finalScore: number) {
    try {
      const api = (await import("@/lib/api")).default
      await api.post("/history/quiz", {
        topic,
        difficulty,
        score: finalScore,
        totalQuestions: questions.length
      })
    } catch (error) {
      console.error("Failed to save quiz result", error)
    }
  }

  function handleRestart() {
    setQuizStarted(false)
    setTopic("")
    setDifficulty("medium")
    setQuestions([])
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setFinished(false)
  }

  if (!quizStarted) {
    return (
      <div className="mx-auto max-w-xl py-12">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm text-center">
          <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-foreground">AI Quiz Generator</h1>
          <p className="mb-8 text-muted-foreground">Enter a topic and generate a custom quiz instantly.</p>

          <div className="flex flex-col gap-4 text-left">
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input
                placeholder="e.g. Mathematics, Physics, Chemistry..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={startQuiz}
              disabled={!topic || loading}
              className="mt-4 h-12 gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Generating Quiz..." : "Generate Quiz"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 shadow-lg">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h1 className="mb-2 text-4xl font-bold text-foreground">Quiz Complete!</h1>
        <p className="mb-8 text-muted-foreground">
          Topic: <span className="font-semibold text-foreground">{topic}</span> ({difficulty})
        </p>

        <div className="mb-8 w-full max-w-sm rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div className="mb-4 text-6xl font-bold gradient-text">{percentage}%</div>
          <p className="mb-2 text-lg text-foreground">
            {score} out of {questions.length} correct
          </p>
          <p className="text-sm text-muted-foreground">
            {percentage >= 80
              ? "Excellent work! You have a strong understanding of the material."
              : percentage >= 60
                ? "Good job! Keep studying to improve your score."
                : "Keep practicing! Review your notes and try again."}
          </p>
        </div>

        <Button
          onClick={handleRestart}
          className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm"
        >
          <RotateCcw className="h-4 w-4" />
          Create New Quiz
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Question {currentQ + 1} of {questions.length}
          </span>
          <span className="flex items-center gap-1.5 font-medium text-primary">
            <Target className="h-4 w-4" />
            Score: {score}/{currentQ + (answered ? 1 : 0)}
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-secondary [&>div]:bg-primary" />
      </div>

      <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
        <h2 className="mb-8 text-xl font-semibold leading-relaxed text-foreground md:text-2xl">
          {currentQuestion.question}
        </h2>

        <div className="flex flex-col gap-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selected === index
            const isCorrect = option === currentQuestion.correctAnswer
            const showCorrect = answered && isCorrect
            const showWrong = answered && isSelected && !isCorrect

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={answered}
                className={cn(
                  "flex items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200",
                  !answered && isSelected
                    ? "border-primary bg-primary/5 text-foreground shadow-sm"
                    : !answered
                      ? "border-border bg-secondary/50 text-foreground hover:border-primary/30 hover:bg-secondary"
                      : showCorrect
                        ? "border-accent bg-accent/5 text-foreground"
                        : showWrong
                          ? "border-destructive bg-destructive/5 text-foreground"
                          : "border-border/50 bg-secondary/30 text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                    !answered && isSelected
                      ? "bg-primary/10 text-primary"
                      : !answered
                        ? "bg-secondary text-muted-foreground"
                        : showCorrect
                          ? "bg-accent/10 text-accent"
                          : showWrong
                            ? "bg-destructive/10 text-destructive"
                            : "bg-secondary text-muted-foreground"
                  )}
                >
                  {answered && showCorrect ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : answered && showWrong ? (
                    <XCircle className="h-5 w-5" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </div>
                <span className="text-sm font-medium">{option}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-8 flex justify-end">
          {!answered ? (
            <Button
              onClick={handleCheck}
              disabled={selected === null}
              className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm"
            >
              Check Answer
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm"
            >
              {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
