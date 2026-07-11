import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchApi } from "@/api/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Task } from "@shared/types"

export function PlanDay() {
  const queryClient = useQueryClient()
  
  const [name, setName] = useState("")
  const [duration, setDuration] = useState("30")
  const [importance, setImportance] = useState("2")

  // Fetch today's tasks
  const { data: tasksData, isLoading } = useQuery<{ success: boolean; tasks: Task[] }>({
    queryKey: ['tasks'],
    queryFn: () => fetchApi('/tasks'),
  })

  // Create a new task
  const createTaskMutation = useMutation({
    mutationFn: (newTask: Partial<Task>) => 
      fetchApi('/tasks', {
        method: 'POST',
        body: JSON.stringify(newTask),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setName("")
    },
  })

  // Generate Plan
  const generatePlanMutation = useMutation({
    mutationFn: (availableMinutes: number) =>
      fetchApi('/scheduler/generate', {
        method: 'POST',
        body: JSON.stringify({ availableMinutes }),
      }),
    onSuccess: () => {
      alert("Plan generated successfully! Check Dashboard.")
    },
  })

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    createTaskMutation.mutate({
      name,
      durationMinutes: parseInt(duration),
      importance: parseInt(importance) as 1 | 2 | 3 | 4,
      mustFinishToday: false,
    })
  }

  const handleGeneratePlan = () => {
    const available = prompt("How many total minutes do you have to work today?", "240")
    if (available) {
      generatePlanMutation.mutate(parseInt(available))
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Plan Your Day</h1>
        <p className="text-muted-foreground text-sm">Dump all your tasks here. Let the engine sort them.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Task</CardTitle>
          <CardDescription>Don't worry about order, just brain dump.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="space-y-4">
            <Input 
              placeholder="E.g., Read chapter 4..." 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={createTaskMutation.isPending}
            />
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium">Minutes</label>
                <Input 
                  type="number" 
                  value={duration} 
                  onChange={(e) => setDuration(e.target.value)} 
                  min="15" 
                  max="480"
                  step="15"
                />
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-medium">Importance</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={importance}
                  onChange={(e) => setImportance(e.target.value)}
                >
                  <option value="1">⭐ (Low)</option>
                  <option value="2">⭐⭐ (Medium)</option>
                  <option value="3">⭐⭐⭐ (High)</option>
                  <option value="4">⭐⭐⭐⭐ (Critical)</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending ? 'Adding...' : 'Add Task'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Today's Task Pool</h2>
          <span className="text-sm text-muted-foreground">{tasksData?.tasks?.length || 0} tasks</span>
        </div>
        
        {isLoading ? (
          <p className="text-sm text-center py-4">Loading tasks...</p>
        ) : (
          <div className="space-y-2">
            {tasksData?.tasks?.map((task) => (
              <div key={task.id} className="flex justify-between items-center p-3 border rounded-md text-sm">
                <span className="font-medium">{task.name}</span>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span>{task.durationMinutes}m</span>
                  <span>{'⭐'.repeat(task.importance)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <Button 
          className="w-full h-12 text-lg font-bold" 
          onClick={handleGeneratePlan}
          disabled={!tasksData?.tasks?.length || generatePlanMutation.isPending}
        >
          {generatePlanMutation.isPending ? 'Generating...' : '⚡ Generate My Plan'}
        </Button>
      </div>
    </div>
  )
}
