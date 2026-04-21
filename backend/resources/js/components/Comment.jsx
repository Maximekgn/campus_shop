import { useForm } from '@inertiajs/react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Send } from 'lucide-react'

export default function CommentSheet({ open, onClose, listing }) {
    const { data, setData, post, processing, reset } = useForm({ body: '' })

    const submit = () => {
        if (!data.body.trim()) return
        post(`/listings/${listing.id}/comments`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => reset(),
        })
    }

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent
                side="bottom"
                className="h-[75vh] rounded-t-2xl bg-zinc-900 border-zinc-700 flex flex-col p-0"
            >
                <SheetHeader className="px-4 pt-4 pb-3 border-b border-zinc-700">
                    <SheetTitle className="text-white text-base font-semibold">
                        Commentaires
                    </SheetTitle>
                </SheetHeader>

                {/* Liste des commentaires */}
                <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
                    {listing?.comments?.length === 0 && (
                        <p className="text-zinc-500 text-sm text-center mt-8">
                            Aucun commentaire pour l'instant
                        </p>
                    )}
                    {listing?.comments?.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-3">
                            <Avatar className="w-8 h-8 shrink-0">
                                <AvatarImage src={comment.user.avatar} />
                                <AvatarFallback className="bg-zinc-700 text-white text-xs">
                                    {comment.user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <span className="text-white text-xs font-semibold">
                                    {comment.user.name}
                                </span>
                                <p className="text-zinc-300 text-sm mt-0.5">{comment.body}</p>
                                <span className="text-zinc-500 text-[11px]">{comment.created_at}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input commentaire */}
                <div className="px-4 py-3 border-t border-zinc-700 flex gap-2 items-center">
                    <Input
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submit()}
                        placeholder="Ajouter un commentaire..."
                        className="flex-1 bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-400 rounded-full px-4"
                    />
                    <Button
                        size="icon"
                        onClick={submit}
                        disabled={processing}
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
