import { useQuery } from "@tanstack/react-query"
import { fetchApi } from "@/api/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileData {
  name: string
  identityStage: string
  xp: number
  streakDays: number
  totalTasksCompleted: number
}

export function History() {
  const { data, isLoading } = useQuery<{ success: boolean; profile: ProfileData }>({
    queryKey: ['profile'],
    queryFn: () => fetchApi('/user/profile'),
  })

  if (isLoading) return <div className="p-8 text-center">Loading profile...</div>

  const profile = data?.profile
  if (!profile) return <div className="p-8 text-center">Profile not found</div>

  const stageIcons: Record<string, string> = {
    EXPLORER: '🌱',
    CONSISTENT: '🔄',
    FOCUSED: '🎯',
    RELIABLE: '🧱',
    UNBREAKABLE: '🗿',
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-1 mt-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Pilot Profile</h1>
        <p className="text-muted-foreground text-sm">Building consistency, one day at a time.</p>
      </div>

      <Card className="border-2 border-primary/20 bg-primary/5 shadow-md">
        <CardContent className="p-6 text-center space-y-4">
          <div className="text-6xl mb-2">{stageIcons[profile.identityStage] || '🌱'}</div>
          <h2 className="text-2xl font-bold">{profile.identityStage}</h2>
          <p className="text-sm text-muted-foreground">Keep showing up to reach the next stage.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground tracking-wider">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              <span>🔥</span> {profile.streakDays}
            </div>
            <p className="text-xs text-muted-foreground mt-1">days in a row</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground tracking-wider">Total XP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold flex items-center gap-2">
              <span>✨</span> {profile.xp}
            </div>
            <p className="text-xs text-muted-foreground mt-1">earned by focusing</p>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase text-muted-foreground tracking-wider">Tasks Conquered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black flex items-center gap-2">
              <span>✅</span> {profile.totalTasksCompleted}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
