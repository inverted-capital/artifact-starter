import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { usePrivy } from '@privy-io/react-auth'
import FileBrowser from './components/FileBrowser'

function App() {
  const [count, setCount] = useState(0)
  const { user, logout } = usePrivy()

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Privy</h1>
      
      <div className="card">
          <div>
            <p>Welcome, {user?.email?.address || user?.wallet?.address || 'User'}!</p>
            <button onClick={logout} style={{ marginBottom: '1rem' }}>
              Sign Out
            </button>
            
            <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
              <h2>Artifact File Browser</h2>
              <FileBrowser />
            </div>
          </div>

        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App