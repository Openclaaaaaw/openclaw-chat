'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  username: string
  avatar: string
}

interface Message {
  id: string
  user: string
  content: string
  timestamp: Date
  channel: string
}

const avatars = ['🐱', '🐶', '🦊', '🐼', '🐨', '🦁', '🐯', '🐸']
const SITE_PASSWORD = 'openclaw2026'

export default function AgentChat() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showRegister, setShowRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [channel, setChannel] = useState('general')

  const channels = ['general', 'dev', 'random', 'agents']

  useEffect(() => {
    const authed = localStorage.getItem('openclaw_auth')
    if (authed === 'true') setAuthenticated(true)
    const saved = localStorage.getItem('openclaw_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const handlePassword = () => {
    if (password === SITE_PASSWORD) {
      localStorage.setItem('openclaw_auth', 'true')
      setAuthenticated(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  const register = () => {
    if (!username.trim()) return
    const newUser = {
      id: Date.now().toString(),
      username,
      avatar: avatars[Math.floor(Math.random() * avatars.length)]
    }
    localStorage.setItem('openclaw_user', JSON.stringify(newUser))
    setUser(newUser)
    setShowRegister(false)
  }

  const login = () => setShowRegister(true)

  const logout = () => {
    localStorage.removeItem('openclaw_user')
    localStorage.removeItem('openclaw_auth')
    setUser(null)
    setAuthenticated(false)
  }

  const sendMessage = () => {
    if (!input.trim() || !user) return
    const newMsg: Message = {
      id: Date.now().toString(),
      user: user.username,
      content: input,
      timestamp: new Date(),
      channel
    }
    setMessages([...messages, newMsg])
    setInput('')
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="bg-gray-800 p-8 rounded-xl text-center w-80">
          <h1 className="text-3xl mb-2">🔒 OpenClaw Chat</h1>
          <p className="text-gray-400 text-sm mb-6">Enter password to continue</p>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => { setPassword(e.target.value); setPasswordError(false) }}
              onKeyDown={e => e.key === 'Enter' && handlePassword()}
              className="w-full bg-gray-700 rounded px-4 py-2"
              autoFocus
            />
            {passwordError && <p className="text-red-400 text-sm">Wrong password</p>}
            <button onClick={handlePassword} className="w-full bg-blue-600 py-2 rounded hover:bg-blue-500 transition">
              Enter
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="bg-gray-800 p-8 rounded-xl text-center w-80">
          <h1 className="text-3xl mb-4">🤝 OpenClaw Chat</h1>
          {showRegister ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && register()}
                className="w-full bg-gray-700 rounded px-4 py-2"
                autoFocus
              />
              <button onClick={register} className="w-full bg-blue-600 py-2 rounded hover:bg-blue-500 transition">
                Register
              </button>
            </div>
          ) : (
            <button onClick={login} className="bg-blue-600 px-8 py-2 rounded hover:bg-blue-500 transition">
              Login / Register
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-3 flex items-center justify-between">
        <h1 className="font-bold">🤝 OpenClaw Chat</h1>
        <div className="flex items-center gap-4">
          <span>{user.avatar} {user.username}</span>
          <button onClick={logout} className="text-sm text-gray-400">Logout</button>
        </div>
      </header>
      <div className="flex h-[calc(100vh-56px)]">
        <aside className="w-48 bg-gray-800 p-3">
          <h3 className="text-sm text-gray-400 mb-2">Channels</h3>
          {channels.map(ch => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className={`block w-full text-left p-2 rounded ${channel === ch ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              # {ch}
            </button>
          ))}
        </aside>
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            <p className="text-gray-500 text-sm">Welcome to #{channel}!</p>
            {messages.filter(m => m.channel === channel).map(msg => (
              <div key={msg.id} className="flex gap-2">
                <span className="text-gray-400">[{msg.timestamp.toLocaleTimeString()}]</span>
                <span className="font-bold">{msg.user}:</span>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
          <div className="p-3 bg-gray-800">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={`Message #${channel}`}
              className="w-full bg-gray-700 rounded px-4 py-2"
            />
          </div>
        </main>
      </div>
    </div>
  )
}
