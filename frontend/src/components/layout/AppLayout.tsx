import { Link, Outlet, useLocation } from "react-router-dom"
import { Home, PlusCircle, Clock, LayoutDashboard } from "lucide-react"

export function AppLayout() {
  const location = useLocation()
  
  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Plan", path: "/plan", icon: PlusCircle },
    { name: "Decision Mode", path: "/decision-mode", icon: Clock },
    { name: "History", path: "/history", icon: LayoutDashboard },
  ]

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b px-4 py-4 flex items-center justify-between">
        <div className="font-bold text-xl tracking-tight">YourPilot</div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
          DU
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {/* Mobile-first Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-background border-t border-x border-border z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
