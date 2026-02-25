'use client'

import { useState } from 'react'

interface Message {
  id: string
  agent: string
  content: string
  timestamp: Date
}

const agents = [
  { id: 'claude', name: 'Claude', emoji: '🧠', color: 'bg-orange-500' },
  { id: 'gpt', name: 'GPT', emoji: '🤖', color: 'bg-green-500' },
  { id: 'gemini', name: 'Gemini', emoji: '✨', color: 'bg-blue-500' },
  { id: 'llama', name: 'Llama', emoji: '🦙', color: 'bg-purple-500' },
]

export default function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', agent: 'claude', content: 'Hello! I am Claude, ready to help!', timestamp: new Date() }
  ])
  const [selectedAgent, setSelectedAgent] = useState('claude')
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    
    const newMsg: Message = {
      id: Date.now().toString(),
      agent: selectedAgent,
      content: input,
      timestamp: new Date()
    }
    setMessages([...messages, newMsg])
    setInput('')
    
    // Simulate response
    setTimeout(() => {
      const responses = [
        'I understand! Let me help with that.',
        'Good point! I\'ll work on that.',
        'Acknowledged! Processing your request.',
        'Great question! Here\'s what I think...',
      ]
      const response: Message = {
        id: (Date.now() + 1).toString(),
        agent: agents[Math.floor(Math.random() * agents.length)].id,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      }
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">🤝 Agent Chat</h1>
        <div className="flex gap-2">
          {agents.map(agent => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id)}
              className={`px-3 py-1 rounded-full ${agent.color} ${selectedAgent === agent.id ? 'ring-2 ring-white' : ''}`}
            >
              {agent.emoji} {agent.name}
            </button>
          ))}
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Agents Panel */}
        <aside className="w-64 bg-gray-800 p-4">
          <h2 className="font-bold mb-4">Agents</h2>
          {agents.map(agent => (
            <div key={agent.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700">
              <span className={`w-2 h-2 rounded-full ${agent.color}`} />
              <span>{agent.emoji}</span>
              <span>{agent.name}</span>
              <span className="ml-auto text-xs text-green-400">●</span>
            </div>
          ))}
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map(msg => {
              const agent = agents.find(a => a.id === msg.agent)
              return (
                <div key={msg.id} className={`flex ${msg.agent === selectedAgent ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md p-3 rounded-lg ${msg.agent === selectedAgent ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{agent?.emoji}</span>
                      <span className="text-xs opacity-70">{agent?.name}</span>
                    </div>
                    <p>{msg.content}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input */}
          <div className="p-4 bg-gray-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 rounded-lg px-4 py-2"
              />
              <button onClick={sendMessage} className="bg-blue-600 px-6 py-2 rounded-lg">
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
