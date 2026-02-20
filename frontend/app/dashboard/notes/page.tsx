"use client"

import { useState, useEffect, useRef } from "react"
import {
  FileText,
  Plus,
  Brain,
  Calendar,
  Upload,
  X,
  Trash2,
  File as FileIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function NotesPage() {
  const [showUpload, setShowUpload] = useState(false)
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [summarizingNoteId, setSummarizingNoteId] = useState<string | null>(null)
  const [summaries, setSummaries] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  async function fetchNotes() {
    try {
      const api = (await import("@/lib/api")).default
      const { data } = await api.get("/notes")
      setNotes(data)
    } catch (error) {
      console.error("Failed to fetch notes", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault()
    if (!title) return

    setUploading(true)
    try {
      const api = (await import("@/lib/api")).default
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      if (file) {
        formData.append("file", file)
      }

      await api.post("/notes", formData, {
        headers: {
          'Content-Type': undefined,
        }
      })

      setTitle("")
      setContent("")
      setFile(null)
      setShowUpload(false)
      fetchNotes()
    } catch (error) {
      console.error("Failed to create note", error)
      alert("Failed to create note. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  async function handleDeleteNote(id: string) {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      const api = (await import("@/lib/api")).default
      await api.delete(`/notes/${id}`)
      setNotes(notes.filter((note) => note._id !== id))
    } catch (error) {
      console.error("Failed to delete note", error)
    }
  }

  async function handleSummarize(note: any) {
    const contentToSummarize = note.content || ""
    setSummarizingNoteId(note._id)
    try {
      const api = (await import("@/lib/api")).default
      const { data } = await api.post("/ai/summary", {
        content: contentToSummarize,
        noteId: note._id
      })
      setSummaries((prev) => ({ ...prev, [note._id]: data.summary }))
    } catch (error) {
      console.error("Failed to summarize note", error)
      setSummaries((prev) => ({ ...prev, [note._id]: "Failed to summarize. Please try again." }))
    } finally {
      setSummarizingNoteId(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Notes</h1>
          <p className="mt-1 text-muted-foreground">
            Upload and manage your study materials
          </p>
        </div>
        <Button
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-sm"
          onClick={() => setShowUpload(!showUpload)}
        >
          {showUpload ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showUpload ? "Close" : "Create Note"}
        </Button>
      </div>

      {showUpload && (
        <div className="mb-8 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 transition-all">
          <form onSubmit={handleCreateNote} className="mx-auto max-w-2xl flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-foreground text-center mb-4">
              Add a New Note
            </h3>
            <Input
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background"
              required
            />

            <div
              className="flex items-center gap-4 rounded-lg border border-border/50 bg-background p-3 cursor-pointer hover:border-primary/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {file ? file.name : "Upload a file (PDF, DOCX, TXT)"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Click to browse"}
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0])
                  }
                }}
              />
              {file && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Textarea
              placeholder="Or paste your note content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-background min-h-[150px]"
            />
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? "Saving..." : "Save Note"}
            </Button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No notes found. Create one to get started!</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note._id}
              className="glass group relative overflow-hidden rounded-xl border border-border/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:glow-sm"
            >
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <h3 className="mb-1 text-base font-semibold text-foreground truncate">
                {note.title}
              </h3>

              {note.originalName && (
                <div className="mb-2 flex items-center gap-1 text-xs text-primary/80 bg-primary/5 p-1 rounded">
                  <FileIcon className="h-3 w-3" />
                  <span className="truncate">{note.originalName}</span>
                </div>
              )}

              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                {note.content}
              </p>

              <div className="mb-5 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5 border-border/50 text-xs text-foreground hover:border-primary/30 hover:bg-primary/5"
                  onClick={() => handleSummarize(note)}
                  disabled={summarizingNoteId === note._id}
                >
                  <Brain className="h-3.5 w-3.5 text-primary" />
                  {summarizingNoteId === note._id ? "Summarizing..." : "Summarize"}
                </Button>
              </div>
              {summaries[note._id] && (
                <div className="mt-3 rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground border border-primary/10">
                  <p className="font-semibold text-primary mb-1">Summary</p>
                  <p className="whitespace-pre-wrap">{summaries[note._id]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
