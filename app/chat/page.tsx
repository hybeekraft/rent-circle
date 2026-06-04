'use client'
import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Image, Mic, MoreVertical, Phone, Shield, AlertTriangle } from 'lucide-react'

const CONVERSATIONS = [
  { id: '1', name: 'Chioma Okafor', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100', lastMsg: 'Are you still interested in the room?', time: '2m', unread: 2, verified: true },
  { id: '2', name: 'Emeka Eze', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100', lastMsg: 'Cool! I can do a viewing this Saturday', time: '1h', unread: 0, verified: true },
  { id: '3', name: 'Zara Abdullahi', avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100', lastMsg: 'The rent is ₦95k/month', time: '2h', unread: 1, verified: false },
]

const MOCK_MESSAGES = [
  { id: '1', sender: 'them', text: 'Hi! I saw your profile on RentCircle. Are you still looking for a flat in Yaba?', time: '10:02 AM' },
  { id: '2', sender: 'me', text: 'Yes I am! What\'s the rent situation like?', time: '10:05 AM' },
  { id: '3', sender: 'them', text: 'It\'s ₦85k per month all inclusive. 3 bedrooms, 2 of us currently. Looking for one more person 🙂', time: '10:07 AM' },
  { id: '4', sender: 'me', text: 'That sounds great! Is there 24hr electricity?', time: '10:09 AM' },
  { id: '5', sender: 'them', text: 'We have a generator for backup. NEPA is actually pretty stable in this area though — maybe 18hrs/day average', time: '10:11 AM' },
  { id: '6', sender: 'them', text: 'Are you still interested in the room?', time: '10:15 AM' },
]

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [input, setInput] = useState('')
  const [showReport, setShowReport] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    if (!input.trim()) return
    setMessages(m => [...m, { id: Date.now().toString(), sender: 'me', text: input, time: 'Just now' }])
    setInput('')
  }

  const activePerson = CONVERSATIONS.find(c => c.id === activeChat)

  if (activeChat && activePerson) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ink-100 bg-white sticky top-0 z-10">
          <button onClick={() => setActiveChat(null)} className="p-1">
            <ArrowLeft size={20} className="text-ink-600" />
          </button>
          <img src={activePerson.avatar} alt={activePerson.name} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-ink-900 text-sm">{activePerson.name}</p>
              {activePerson.verified && <Shield size={13} className="text-green-500" />}
            </div>
            <p className="text-xs text-green-500">Active now</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl hover:bg-ink-100"><Phone size={18} className="text-ink-500" /></button>
            <button onClick={() => setShowReport(true)} className="p-2 rounded-xl hover:bg-ink-100"><MoreVertical size={18} className="text-ink-500" /></button>
          </div>
        </div>

        {/* Safety banner */}
        <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-start gap-2">
          <Shield size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">Never send money to someone you haven't met. RentCircle will never ask for payment through chat.</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'me'
                    ? 'bg-brand-500 text-white rounded-br-sm'
                    : 'bg-ink-100 text-ink-900 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
                <span className="text-xs text-ink-400">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-ink-100 bg-white pb-safe">
          <div className="flex items-center gap-2">
            <button className="p-2 text-ink-400"><Image size={20} /></button>
            <button className="p-2 text-ink-400"><Mic size={20} /></button>
            <div className="flex-1 flex items-center bg-ink-50 rounded-2xl px-4 py-2.5 gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm outline-none text-ink-900 placeholder:text-ink-400"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform"
            >
              <Send size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Report sheet */}
        {showReport && (
          <div className="fixed inset-0 z-50 flex items-end" style={{background:'rgba(0,0,0,0.5)'}} onClick={() => setShowReport(false)}>
            <div className="bg-white rounded-t-3xl w-full p-6" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-ink-200 rounded-full mx-auto mb-5" />
              <h3 className="font-semibold text-ink-900 mb-4">Options</h3>
              {[
                { icon: AlertTriangle, label: 'Report as suspicious', color: 'text-amber-600' },
                { icon: Shield, label: 'Block this user', color: 'text-red-500' },
              ].map(({ icon: Icon, label, color }) => (
                <button key={label} className={`flex items-center gap-3 w-full py-3 text-sm ${color}`} onClick={() => setShowReport(false)}>
                  <Icon size={18} />{label}
                </button>
              ))}
              <button className="w-full py-3 text-sm text-ink-500 border-t border-ink-100 mt-2" onClick={() => setShowReport(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="bg-white px-4 py-4 border-b border-ink-100">
        <h1 className="text-xl font-bold text-ink-900">Messages</h1>
      </div>
      <div className="flex flex-col">
        {CONVERSATIONS.map(conv => (
          <button
            key={conv.id}
            onClick={() => setActiveChat(conv.id)}
            className="flex items-center gap-3 px-4 py-4 bg-white border-b border-ink-50 active:bg-ink-50 transition-colors"
          >
            <div className="relative">
              <img src={conv.avatar} alt={conv.name} className="w-14 h-14 rounded-full object-cover" />
              {conv.verified && <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white"><Shield size={10} className="text-white" /></div>}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-0.5">
                <p className="font-semibold text-ink-900 text-sm">{conv.name}</p>
                <p className="text-xs text-ink-400">{conv.time}</p>
              </div>
              <p className="text-sm text-ink-500 truncate">{conv.lastMsg}</p>
            </div>
            {conv.unread > 0 && (
              <div className="w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{conv.unread}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
