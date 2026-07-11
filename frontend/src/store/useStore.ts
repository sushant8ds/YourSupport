import { create } from 'zustand'

export type ActiveTask = {
  id: string
  name: string
  durationMinutes: number
}

interface AppState {
  activeTask: ActiveTask | null
  timerSecondsElapsed: number
  isTimerRunning: boolean
  
  // Actions
  setActiveTask: (task: ActiveTask | null) => void
  setTimerSecondsElapsed: (seconds: number) => void
  setIsTimerRunning: (isRunning: boolean) => void
  incrementTimer: () => void
  resetTimer: () => void
}

export const useStore = create<AppState>((set) => ({
  activeTask: null,
  timerSecondsElapsed: 0,
  isTimerRunning: false,
  
  setActiveTask: (task) => set({ activeTask: task }),
  setTimerSecondsElapsed: (seconds) => set({ timerSecondsElapsed: seconds }),
  setIsTimerRunning: (isRunning) => set({ isTimerRunning: isRunning }),
  incrementTimer: () => set((state) => ({ timerSecondsElapsed: state.timerSecondsElapsed + 1 })),
  resetTimer: () => set({ activeTask: null, timerSecondsElapsed: 0, isTimerRunning: false }),
}))
