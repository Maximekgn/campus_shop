import { Plus } from 'lucide-react'
import { Avatar as ShadAvatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function SellerAvatar({ src = '/images/tom.jpg', alt = 'Vendeur', fallback = 'VD' }) {
    return (
        <div className="relative w-11 h-11">
            <ShadAvatar className="w-11 h-11 border-2 border-[#C9A84C]">
                <AvatarImage src={src} alt={alt} className="object-cover" />
                <AvatarFallback className="bg-[#C9A84C] text-white text-xs font-bold">
                    {fallback}
                </AvatarFallback>
            </ShadAvatar>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full
                            bg-[#C9A84C] flex items-center justify-center">
                <Plus size={12} color="white" strokeWidth={3} />
            </div>
        </div>
    )
}
