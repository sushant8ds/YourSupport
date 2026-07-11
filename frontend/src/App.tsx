import { Routes, Route } from 'react-router-dom'

// Simple placeholder components until we build out the real pages
const Home = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">YourPilot</h1>
    <p>Stop deciding. Start doing.</p>
  </div>
)

const NotFound = () => (
  <div className="p-8">
    <h1 className="text-xl font-bold">404 - Not Found</h1>
  </div>
)

export default function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <main className="max-w-md mx-auto min-h-screen border-x border-border shadow-sm">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
