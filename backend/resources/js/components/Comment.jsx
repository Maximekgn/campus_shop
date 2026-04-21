import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

export default function ChatSheet({ open, onClose, item }) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([
        { id: 1, from: 'seller', text: 'Bonjour ! Toujours disponible 👋' },
    ])

    const send = () => {
        if (!message.trim()) return
        setMessages(prev => [...prev, { id: Date.now(), from: 'me', text: message }])
        setMessage('')
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent
                side="bottom"
                className="h-[70vh] rounded-t-2xl bg-zinc-900 border-zinc-700 flex flex-col p-0"
            >
                <SheetHeader className="px-4 pt-4 pb-3 border-b border-zinc-700">
                    <SheetTitle className="text-white text-base font-semibold">
                        {item?.title}
                    </SheetTitle>
                    <p className="text-[#C9A84C] text-sm font-bold">{item?.price}</p>
                </SheetHeader>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
                    {messages.map((msg) => (
                        <div key={msg.id}
                             className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                                 msg.from === 'me'
                                     ? 'self-end bg-[#C9A84C] text-white rounded-br-sm'
                                     : 'self-start bg-zinc-700 text-white rounded-bl-sm'
                             }`}>
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-zinc-700 flex gap-2 items-center">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && send()}
                        placeholder="Écrire un message..."
                        className="flex-1 bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400 rounded-full px-4"
                    />
                    <Button
                        size="icon"
                        onClick={send}
                        className="rounded-full w-10 h-10 shrink-0"
                        style={{ background: '#C9A84C' }}
                    >
                        <Send size={16} color="white" />
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
