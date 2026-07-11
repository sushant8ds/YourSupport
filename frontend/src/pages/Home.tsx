import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { fetchApi } from "@/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Task } from "@shared/types"

interface PlanData {
  id: string
  availableMinutes: number
  tasks: {
    id: string
    taskId: string
    action: string
    note: string
    orderIndex: number
    task: Task
  }[]
}

export function Home() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLostMinutes, setSelectedLostMinutes] = useState<number | null>(null)

  const { data, isLoading } = useQuery<{ success: boolean; plan: PlanData }>({
    queryKey: ['dailyPlan'],
    queryFn: () => fetchApi('/scheduler/plan'),
  })

  const replanMutation = useMutation({
    mutationFn: (lostMinutes: number) => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const mins = String(now.getMinutes()).padStart(2, '0')
      
      return fetchApi<{ success: boolean; message: string }>('/scheduler/replan', {
        method: 'POST',
        body: JSON.stringify({
          timeLostMinutes: lostMinutes,
          currentTime: `${hours}:${mins}`,
          sleepTime: '23:00' // Default assumption for MVP
        })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyPlan'] })
    },
  })

  if (isLoading) return <div className="p-8 text-center">Loading your plan...</div>

  const plan = data?.plan

  if (!plan || plan.tasks.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-4xl">🌤️</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Good morning!</h1>
          <p className="text-muted-foreground">You haven't generated a plan for today yet.</p>
        </div>
        <Button size="lg" onClick={() => navigate('/plan')}>
          Plan Your Day
        </Button>
      </div>
    )
  }

  const nextTaskObj = plan.tasks.find(t => t.task.status === 'PENDING')

  const handleLifeHappened = (minutes: number) => {
    setSelectedLostMinutes(minutes)
    replanMutation.mutate(minutes)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedLostMinutes(null)
    replanMutation.reset()
  }

  return (
    <div className="p-4 space-y-6 pb-24 relative">
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          className="border-primary/20 text-primary hover:bg-primary/10 transition-colors gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <span>⚡</span> Life Happened
        </Button>
      </div>

      {nextTaskObj ? (
        <Card className="border-2 border-primary/20 bg-primary/5 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary uppercase tracking-wider">Up Next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{nextTaskObj.task.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{nextTaskObj.note}</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-medium bg-background/50 p-3 rounded-md">
              <div className="flex items-center gap-1.5">
                <span>⏱️</span> {nextTaskObj.task.durationMinutes} min
              </div>
              <div className="flex items-center gap-1.5">
                <span>⭐</span> {nextTaskObj.task.importance}
              </div>
            </div>

            <Button 
              className="w-full text-lg h-12" 
              onClick={() => navigate(`/timer/${nextTaskObj.task.id}`)}
            >
              Start Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-green-500/20 bg-green-500/5">
          <CardContent className="p-8 text-center space-y-4">
            <div className="text-4xl">🎉</div>
            <h2 className="text-2xl font-bold">All done for today!</h2>
            <p className="text-muted-foreground">You completed your plan. Go enjoy the rest of your day.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3 pt-6">
        <h3 className="font-semibold text-lg">Today's Flight Path</h3>
        <div className="space-y-3">
          {plan.tasks.map((pt) => {
            const isCompleted = pt.task.status === 'COMPLETED'
            const isPending = pt.task.status === 'PENDING'
            
            return (
              <div 
                key={pt.id} 
                className={`flex gap-4 p-3 rounded-lg border ${
                  isCompleted ? 'bg-muted/50 opacity-60' : 
                  isPending ? 'bg-card' : 'bg-card'
                }`}
              >
                <div className="flex-shrink-0 mt-1">
                  {isCompleted ? '✅' : '⏳'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className={`font-medium truncate ${isCompleted ? 'line-through' : ''}`}>
                      {pt.task.name}
                    </p>
                    <span className="text-xs font-semibold whitespace-nowrap ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {pt.task.durationMinutes}m
                    </span>
                  </div>
                  {!isCompleted && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{pt.note}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-sm shadow-xl border-primary/20">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2">⚡</div>
              <CardTitle className="text-xl">Life Happened</CardTitle>
            </CardHeader>
            <CardContent>
              {!replanMutation.isSuccess ? (
                <div className="space-y-4">
                  <p className="text-center text-muted-foreground text-sm">How much time did you lose?</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[15, 30, 45, 60, 90, 120].map(mins => (
                      <Button 
                        key={mins} 
                        variant="outline" 
                        onClick={() => handleLifeHappened(mins)}
                        disabled={replanMutation.isPending}
                        className={selectedLostMinutes === mins ? "bg-primary/10 border-primary" : ""}
                      >
                        {mins} min
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-center animate-in zoom-in duration-300">
                  <div className="p-4 bg-primary/10 rounded-lg text-sm font-medium">
                    {replanMutation.data?.message || "Plan updated."}
                  </div>
                  <Button className="w-full" onClick={handleCloseModal}>
                    Got it. Let's go.
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

