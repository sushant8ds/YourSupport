import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Home } from './pages/Home'
import { PlanDay } from './pages/PlanDay'
import { DecisionMode } from './pages/DecisionMode'
import { Timer } from './pages/Timer'

const History = () => <div className="p-4 flex h-full items-center justify-center text-muted-foreground">History coming soon...</div>
const NotFound = () => <div className="p-4 flex h-full items-center justify-center font-bold text-xl">404 - Not Found</div>

export default function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <div className="max-w-md mx-auto min-h-screen border-x border-border shadow-sm bg-background">
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/plan" element={<PlanDay />} />
            <Route path="/decision-mode" element={<DecisionMode />} />
            <Route path="/history" element={<History />} />
          </Route>
          {/* Full-screen routes outside the bottom-nav layout */}
          <Route path="/timer/:taskId" element={<Timer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}
