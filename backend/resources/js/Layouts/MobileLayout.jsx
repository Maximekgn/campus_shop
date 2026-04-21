import BottomNav from '@/components/BottomNav'

export default function MobileLayout({ children, dark = false }) {
    return (
        <div className={dark ? 'min-h-screen bg-black text-white' : 'min-h-screen bg-[#F9F7F2] text-[#1A1A1A]'}>
            <main className={dark ? 'h-screen overflow-hidden' : 'min-h-screen pb-20'}>
                {children}
            </main>
            <BottomNav />
        </div>
    )
}
