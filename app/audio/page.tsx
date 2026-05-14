'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Download, Trash2, Clock, Loader } from 'lucide-react'

import { apiRequest } from '@/lib/api'

interface RecordingItem {
  id: string
  duration: number
  filePath: string
  createdAt: string
}

export default function AudioPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordings, setRecordings] = useState<RecordingItem[]>([])
  const [recordingTime, setRecordingTime] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    async function loadRecordings() {
      try {
        const data = await apiRequest<{ recordings: RecordingItem[] }>('/api/audio', { method: 'GET' })
        setRecordings(data.recordings)
      } catch {
        setRecordings([])
      }
    }

    loadRecordings()

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const saveRecordingToServer = async (blob: Blob, duration: number) => {
    const formData = new FormData()
    formData.append('file', new File([blob], `recording-${Date.now()}.webm`, { type: 'audio/webm' }))
    formData.append('duration', String(duration))

    const data = await apiRequest<{ record: RecordingItem }>('/api/audio', {
      method: 'POST',
      body: formData,
    })

    setRecordings((prev) => [data.record, ...prev])
  }

  const startRecording = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      setRecordingTime(0)

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const duration = recordingTime
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach((track) => track.stop())

        setSaving(true)
        try {
          await saveRecordingToServer(blob, duration)
        } catch (currentError) {
          setError(currentError instanceof Error ? currentError.message : 'Unable to save recording')
        } finally {
          setSaving(false)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (currentError) {
      console.error('Microphone access denied:', currentError)
      setError('Unable to access microphone. Please check your permissions and sign in to save recordings.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const playRecording = (filePath: string) => {
    const audio = new Audio(filePath)
    audio.play()
  }

  const downloadRecording = (filePath: string, index: number) => {
    const a = document.createElement('a')
    a.href = filePath
    a.download = `recording-${index + 1}.webm`
    a.click()
  }

  const deleteRecording = async (id: string) => {
    try {
      await apiRequest(`/api/audio/${id}`, { method: 'DELETE' })
      setRecordings((prev) => prev.filter((rec) => rec.id !== id))
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Unable to delete recording')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Record Audio</h1>
        <p className="text-muted mb-12">Securely record audio for evidence and protection</p>

        <div className="card mb-12">
          <div className="flex flex-col items-center gap-8">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording
                ? 'bg-alert animate-pulse-alert'
                : 'bg-dark-tertiary hover:bg-border'
            }`}>
              <Mic className="w-16 h-16 text-brand" />
            </div>

            <div className="flex items-center gap-2 text-3xl font-bold text-foreground">
              <Clock className="w-8 h-8 text-brand" />
              <span>{formatTime(recordingTime)}</span>
            </div>

            <div className="flex gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2 px-8 py-4 bg-alert text-white rounded-2xl font-bold text-lg hover:bg-brand-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <Mic className="w-6 h-6" />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-8 py-4 bg-alert text-white rounded-2xl font-bold text-lg hover:bg-brand-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <Square className="w-6 h-6" />
                  Stop Recording
                </button>
              )}
            </div>

            {saving && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <Loader className="w-4 h-4 animate-spin text-brand" />
                Saving recording to your secure vault...
              </div>
            )}

            {error && <p className="text-alert text-sm text-center">{error}</p>}
          </div>
        </div>

        {recordings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Saved Recordings</h2>
            <div className="space-y-3">
              {recordings.map((recording, index) => (
                <div key={recording.id} className="card flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-brand-light/20 flex items-center justify-center">
                      <Mic className="w-6 h-6 text-brand" />
                    </div>
                    <div>
                      <p className="font-semibold">Recording {recordings.length - index}</p>
                      <p className="text-muted text-sm">{formatTime(recording.duration)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => playRecording(recording.filePath)}
                      className="p-3 bg-dark-tertiary hover:bg-border rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Play recording"
                    >
                      <Play className="w-5 h-5 text-success" />
                    </button>
                    <button
                      onClick={() => downloadRecording(recording.filePath, index)}
                      className="p-3 bg-dark-tertiary hover:bg-border rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Download recording"
                    >
                      <Download className="w-5 h-5 text-foreground" />
                    </button>
                    <button
                      onClick={() => deleteRecording(recording.id)}
                      className="p-3 bg-dark-tertiary hover:bg-alert/20 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      title="Delete recording"
                    >
                      <Trash2 className="w-5 h-5 text-alert" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {recordings.length === 0 && !isRecording && !saving && (
          <div className="card text-center py-12">
            <Mic className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
            <p className="text-muted">No recordings yet. Start recording to create your first audio evidence.</p>
          </div>
        )}
      </section>
    </main>
  )
}
