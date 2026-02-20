"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import {
  Send,
  FileText,
  Sparkles,
  User,
  Paperclip,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  role: "user" | "ai"
  content: string
  timestamp: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      content:
        "Hello! I'm your AI study assistant. I've loaded your notes context. What would you like to know?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])
  const [input, setInput] = useState("")
  const [notes, setNotes] = useState<any[]>([])
  const [selectedNote, setSelectedNote] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchNotes() {
      try {
        const api = (await import("@/lib/api")).default
        const { data } = await api.get("/notes")
        setNotes(data)
        if (data.length > 0) setSelectedNote(data[0]._id)
      } catch (error) {
        console.error("Failed to fetch notes", error)
      }
    }
    fetchNotes()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  async function handleSend() {
    if (!input.trim() && !file) return

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input + (file ? ` [Attached: ${file.name}]` : ""),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    setIsTyping(true)

    try {
      const api = (await import("@/lib/api")).default

      let response;
      if (file) {
        const formData = new FormData();
        formData.append("question", input || "Analyze this file");
        formData.append("file", file);

        response = await api.post("/ai/ask", formData, {
          headers: { 'Content-Type': undefined }
        });
        setFile(null);
      } else {
        response = await api.post("/ai/ask", { question: input || "Analyze context" });
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: response.data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (error) {
      console.error("Failed to get AI response", error)
      const errorMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: "Sorry, I encountered an error processing your request.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-7xl gap-4">
      <div className="hidden w-64 flex-shrink-0 rounded-xl border border-border/50 bg-card p-4 lg:block">
        <h3 className="mb-4 text-sm font-semibold text-foreground">My Notes Context</h3>
        <div className="flex flex-col gap-1">
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes uploaded yet.</p>
          ) : (
            notes.map((note) => (
              <button
                key={note._id}
                onClick={() => setSelectedNote(note._id)}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-all",
                  selectedNote === note._id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <FileText className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{note.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col rounded-xl border border-border/50 bg-card">
        <div className="flex items-center gap-3 border-b border-border/50 px-5 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Study Assistant</p>
            <p className="text-xs text-muted-foreground">
              Powered by NVIDIA Nemotron (Free)
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-5" ref={scrollRef}>
          <div className="flex flex-col gap-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                    msg.role === "ai"
                      ? "bg-primary/10"
                      : "bg-accent/10"
                  )}
                >
                  {msg.role === "ai" ? (
                    <Sparkles className="h-4 w-4 text-primary" />
                  ) : (
                    <User className="h-4 w-4 text-accent" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3",
                    msg.role === "ai"
                      ? "bg-secondary/50 text-foreground"
                      : "bg-primary/15 text-foreground"
                  )}
                >
                  {msg.role === "ai" ? (
                    <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed
                      [&>p]:mb-2 [&>p:last-child]:mb-0
                      [&>ul]:mb-2 [&>ul]:list-disc [&>ul]:pl-4
                      [&>ol]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4
                      [&>li]:mb-1
                      [&>h1]:text-base [&>h1]:font-bold [&>h1]:mb-2
                      [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:mb-1
                      [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-1
                      [&>code]:rounded [&>code]:bg-black/30 [&>code]:px-1 [&>code]:text-xs
                      [&>pre]:rounded-lg [&>pre]:bg-black/30 [&>pre]:p-3 [&>pre]:text-xs [&>pre]:overflow-x-auto
                      [&>strong]:font-semibold [&>em]:italic">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {msg.content}
                    </p>
                  )}
                  <span className="mt-1 block text-[10px] text-muted-foreground">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-secondary/50 rounded-2xl px-4 py-3">
                  <p className="text-sm text-muted-foreground">AI is thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border/50 p-4">

          {file && (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-secondary/50 p-2 text-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span className="flex-1 truncate">{file.name}</span>
              <button onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0])
                }
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
              aria-label="Attach file"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={file ? "Ask about this file..." : "Ask about your notes..."}
                rows={1}
                disabled={isTyping}
                className="w-full resize-none rounded-xl border border-border/50 bg-secondary/50 px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <Button
              onClick={handleSend}
              size="icon"
              className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 glow-sm"
              disabled={(!input.trim() && !file) || isTyping}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
