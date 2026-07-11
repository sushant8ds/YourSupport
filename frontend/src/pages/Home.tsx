import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { fetchApi } from "@/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Task } from "@shared/types"

interface PlanData {
  plan: {
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
}

export function Home() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery<{ success: boolean; data: PlanData }>({
    queryKey: ['dailyPlan'],
    queryFn: () => fetchApi('/scheduler/next'),
  })

  const replanMutation = useMutation({
    mutationFn: () => fetchApi('/scheduler/replan', { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dailyPlan'] })
      alert("Plan recalculated!")
    },
  })

  if (isLoading) return <div className="p-8 text-center">Loading your plan...</div>

  const plan = data?.data?.plan

  if (!plan) {
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

  // Get next available task
  const nextTaskObj = plan.tasks.find(t => t.task.status === 'PENDING')

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* ⚡ Life Happened Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          className="border-primary/20 text-primary hover:bg-primary/10 transition-colors gap-2"
          onClick={() => replanMutation.mutate()}
          disabled={replanMutation.isPending}
        >
          <span>⚡</span> Life Happened
        </Button>
      </div>

      {/* Up Next Card */}
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

      {/* Today's Schedule Overview */}
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
    </div>
  )
}
