import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { fetchApi } from "@/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Task } from "@shared/types"

export function DecisionMode() {
  const navigate = useNavigate()
  const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null)
  
  const decisionMutation = useMutation({
    mutationFn: (minutes: number) =>
      fetchApi<{ success: boolean; task: Task }>('/scheduler/decision-mode', {
        method: 'POST',
        body: JSON.stringify({ availableMinutes: minutes }),
      }),
  })

  const handleSelect = (minutes: number) => {
    setSelectedMinutes(minutes)
    decisionMutation.mutate(minutes)
  }

  const times = [15, 30, 45, 60, 90, 120]

  return (
    <div className="p-4 flex flex-col min-h-[80vh]">
      <div className="space-y-2 mb-8 mt-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Decision Mode</h1>
        <p className="text-muted-foreground">Skip the plan. Just tell me how much time you have right now.</p>
      </div>

      {!decisionMutation.data && !decisionMutation.isPending && (
        <div className="grid grid-cols-2 gap-4 flex-1 content-center px-2">
          {times.map((mins) => (
            <Button
              key={mins}
              variant="outline"
              className="h-24 text-2xl font-bold border-2 hover:border-primary hover:bg-primary/5 transition-all"
              onClick={() => handleSelect(mins)}
            >
              {mins} min
            </Button>
          ))}
        </div>
      )}

      {decisionMutation.isPending && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-lg font-medium animate-pulse">Calculating optimal task...</p>
        </div>
      )}

      {decisionMutation.data?.task && (
        <div className="flex-1 flex flex-col justify-center animate-in fade-in zoom-in duration-300">
          <Card className="border-2 border-primary/20 bg-primary/5 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-medium text-primary uppercase tracking-wider">
                Your Optimal Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <h2 className="text-3xl font-bold">{decisionMutation.data.task.name}</h2>
              
              <div className="flex justify-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">⏱️</span> {decisionMutation.data.task.durationMinutes} min
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">⭐</span> {decisionMutation.data.task.importance}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  variant="outline" 
                  className="w-full h-12"
                  onClick={() => {
                    decisionMutation.reset()
                    setSelectedMinutes(null)
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="w-full h-12 text-lg"
                  onClick={() => navigate(`/timer/${decisionMutation.data.task.id}`)}
                >
                  Start Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {decisionMutation.isError && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="text-4xl mb-2">🤷‍♂️</div>
          <h3 className="text-xl font-bold">No tasks fit</h3>
          <p className="text-muted-foreground">
            We couldn't find a pending task that fits in {selectedMinutes} minutes.
          </p>
          <Button onClick={() => decisionMutation.reset()} className="mt-4">
            Try another time
          </Button>
        </div>
      )}
    </div>
  )
}
