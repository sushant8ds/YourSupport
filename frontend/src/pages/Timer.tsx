import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchApi } from "@/api/client"
import { Button } from "@/components/ui/button"
import { Task } from "@shared/types"
import { useStore } from "@/store/useStore"

export function Timer() {
  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { 
    timerSecondsElapsed, 
    isTimerRunning, 
    incrementTimer, 
    setIsTimerRunning, 
    resetTimer 
  } = useStore()

  // We need to fetch the task to know its duration, name, etc.
  // In a real app we'd have a GET /api/tasks/:id, but for now we'll just fetch all tasks
  // and find it, since this is a local MVP.
  const { data, isLoading } = useQuery<{ success: boolean; tasks: Task[] }>({
    queryKey: ['tasks'],
    queryFn: () => fetchApi('/tasks'),
  })

  const completeTaskMutation = useMutation({
    mutationFn: () => fetchApi(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'COMPLETED' })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dailyPlan'] })
      resetTimer()
      navigate('/')
    }
  })

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        incrementTimer()
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, incrementTimer])

  // Start timer on mount if not running
  useEffect(() => {
    if (!isTimerRunning) {
      setIsTimerRunning(true)
    }
    return () => setIsTimerRunning(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <div className="p-8 text-center flex-1 flex items-center justify-center">Loading task...</div>
  
  const task = data?.tasks.find(t => t.id === taskId)
  if (!task) return <div className="p-8 text-center">Task not found</div>

  const totalSeconds = task.durationMinutes * 60
  const progressPercent = Math.min((timerSecondsElapsed / totalSeconds) * 100, 100)
  
  // Format MM:SS
  const mins = Math.floor(timerSecondsElapsed / 60)
  const secs = timerSecondsElapsed % 60
  const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between border-b">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <span className="font-semibold text-sm">Focus Session</span>
        <div className="w-16" /> {/* Spacer */}
      </header>

      {/* Main Timer Display */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        <div className="text-center space-y-2 max-w-sm w-full">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary bg-primary/10 w-fit mx-auto px-3 py-1 rounded-full mb-4">
            <span>⏱️</span> {task.durationMinutes} min target
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{task.name}</h1>
          <p className="text-muted-foreground">Keep your focus here.</p>
        </div>

        {/* Huge Timer */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Progress Ring (fake SVG for MVP) */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
              cx="128" cy="128" r="120" 
              className="stroke-muted fill-none" 
              strokeWidth="8"
            />
            <circle 
              cx="128" cy="128" r="120" 
              className="stroke-primary fill-none transition-all duration-1000 ease-linear" 
              strokeWidth="8"
              strokeDasharray={120 * 2 * Math.PI}
              strokeDashoffset={(120 * 2 * Math.PI) * (1 - progressPercent / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="text-6xl font-black tracking-tighter tabular-nums z-10">
            {timeString}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
          <Button 
            size="lg" 
            variant={isTimerRunning ? "outline" : "default"}
            className="w-full h-14 text-lg font-bold"
            onClick={() => setIsTimerRunning(!isTimerRunning)}
          >
            {isTimerRunning ? "Pause Session" : "Resume Session"}
          </Button>

          <Button 
            size="lg" 
            className="w-full h-14 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
            onClick={() => completeTaskMutation.mutate()}
            disabled={completeTaskMutation.isPending}
          >
            {completeTaskMutation.isPending ? "Completing..." : "Complete Task ✅"}
          </Button>
        </div>
      </main>
    </div>
  )
}
