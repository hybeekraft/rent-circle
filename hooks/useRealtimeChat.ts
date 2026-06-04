'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import type { Message } from '@/types'

export function useRealtimeChat(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [otherTyping, setOtherTyping] = useState(false)
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const supabase = createClient()

  // Load initial messages
  useEffect(() => {
    if (!conversationId) { setLoading(false); return }

    async function load() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (!error && data) setMessages(data as Message[])
      setLoading(false)
    }

    load()
  }, [conversationId])

  // Subscribe to new messages + typing indicators
  useEffect(() => {
    if (!conversationId) return

    const channel = supabase
      .channel(`chat:${conversationId}`)
      // New messages
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages(prev => {
          const exists = prev.some(m => m.id === payload.new.id)
          if (exists) return prev
          return [...prev, payload.new as Message]
        })
      })
      // Read receipts
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages(prev =>
          prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m)
        )
      })
      // Typing indicator (broadcast)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        setOtherTyping(true)
        if (typingTimeout.current) clearTimeout(typingTimeout.current)
        typingTimeout.current = setTimeout(() => setOtherTyping(false), 3000)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      if (typingTimeout.current) clearTimeout(typingTimeout.current)
    }
  }, [conversationId])

  // Mark messages as read
  const markRead = useCallback(async (senderId: string) => {
    if (!conversationId) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.id === senderId) return

    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('sender_id', senderId)
      .is('read_at', null)
  }, [conversationId])

  // Send typing indicator
  const sendTyping = useCallback(async () => {
    if (!conversationId) return
    const channel = supabase.channel(`chat:${conversationId}`)
    await channel.send({ type: 'broadcast', event: 'typing', payload: {} })
  }, [conversationId])

  // Send message
  const sendMessage = useCallback(async (content: string, type: 'text' | 'image' | 'voice' = 'text') => {
    if (!content.trim() || !conversationId) return
    setSending(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSending(false); return }

    // Optimistic update
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: user.id,
      content,
      type,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])

    const { data, error } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, sender_id: user.id, content, type })
      .select()
      .single()

    if (error) {
      // Remove optimistic on failure
      setMessages(prev => prev.filter(m => m.id !== optimistic.id))
    } else if (data) {
      // Replace optimistic with real
      setMessages(prev => prev.map(m => m.id === optimistic.id ? data as Message : m))
      // Update conversation last_message
      await supabase
        .from('conversations')
        .update({ last_message: content, last_message_at: new Date().toISOString() })
        .eq('id', conversationId)
    }

    setSending(false)
  }, [conversationId])

  // Get or create a conversation with another user
  const getOrCreateConversation = useCallback(async (otherUserId: string): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Check existing
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(participant_a.eq.${user.id},participant_b.eq.${otherUserId}),and(participant_a.eq.${otherUserId},participant_b.eq.${user.id})`)
      .single()

    if (existing) return existing.id

    // Create new
    const { data: created, error } = await supabase
      .from('conversations')
      .insert({ participant_a: user.id, participant_b: otherUserId })
      .select('id')
      .single()

    if (error) return null
    return created?.id || null
  }, [])

  return {
    messages,
    loading,
    sending,
    otherTyping,
    sendMessage,
    sendTyping,
    markRead,
    getOrCreateConversation,
  }
}
