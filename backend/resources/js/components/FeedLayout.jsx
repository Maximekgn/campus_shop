import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export default function FeedLayout({
                                       items,
                                       activeIndex,
                                       scrollRef,
                                       onScroll,
                                       onContact,
                                       // Slots injectables
                                       renderActions,   // boutons latéraux droite
                                       renderInfo,      // infos bas gauche
                                       renderTopBar,    // zone haut (optionnel, défaut = bouton contacter)
                                   }) {
    const current = items[activeIndex]

    return (
        <>
            {/* FEED */}
            <div ref={scrollRef} onScroll={onScroll}
                 className="h-screen overflow-y-scroll snap-y snap-mandatory"
                 style={{ scrollbarWidth: 'none' }}>
                {items.map((item) => (
                    <div key={item.id} className="h-screen snap-start shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                ))}
            </div>

            {/* Gradient haut */}
            <div className="fixed inset-x-0 top-0 h-28 z-10 pointer-events-none"
                 style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)' }} />

            {/* Gradient bas */}
            <div className="fixed inset-x-0 bottom-0 h-2/3 z-10 pointer-events-none"
                 style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)' }} />

            {/* Top bar — slot ou défaut */}
            <div className="fixed top-0 left-0 right-0 z-20 flex justify-center"
                 style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
                {renderTopBar ? renderTopBar(current) : (
                    <Button
                        onClick={() => onContact(current)}
                        className="flex items-center gap-2 rounded-full px-6 h-10 font-semibold text-sm shadow-lg active:scale-95 transition-transform"
                        style={{ background: '#C9A84C', color: '#1a1200' }}
                    >
                        <MessageCircle size={16} strokeWidth={2} />
                        Contacter le vendeur
                    </Button>
                )}
            </div>

            {/* Actions latérales droite */}
            {renderActions && (
                <div className="fixed right-4 z-20 flex flex-col items-center gap-4"
                     style={{ bottom: 'calc(env(safe-area-inset-bottom) + 5rem)' }}>
                    {renderActions(current)}
                </div>
            )}

            {/* Infos bas gauche */}
            {renderInfo && (
                <div className="fixed left-4 right-20 z-20"
                     style={{ bottom: 'calc(env(safe-area-inset-bottom) + 5rem)' }}>
                    {renderInfo(current)}
                </div>
            )}
        </>
    )
}
