import { Link, usePage } from '@inertiajs/react'
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react'

const NAV_ITEMS = [
    { href: '/mobile',                 label: 'Accueil',   icon: Home,          match: (url) => url === '/mobile' },
    { href: '/mobile/search',          label: 'Recherche', icon: Search,        match: (url) => url.startsWith('/mobile/search') },
    { href: '/mobile/listings/create', label: 'Poster',    icon: PlusCircle,    match: (url) => url.startsWith('/mobile/listings/create'), featured: true },
    { href: '/mobile/conversations',   label: 'Messages',  icon: MessageCircle, match: (url) => url.startsWith('/mobile/conversations') },
    { href: '/mobile/profile',         label: 'Profil',    icon: User,          match: (url) => url.startsWith('/mobile/profile') },
]

function NavItem({ href, label, icon: Icon, active, featured }) {
    return (
        <Link href={href} className="flex flex-col items-center gap-1 transition-all duration-200">
            {featured ? (
                <div className="w-12 h-12 rounded-full flex items-center justify-center -mt-5 shadow-md"
                     style={{ background: '#C9A84C' }}>
                    <Icon size={22} color="white" strokeWidth={2.5} />
                </div>
            ) : (
                <Icon  size={22} strokeWidth={active ? 2.5 : 1.8} color={ active ? '#C9A84C' : '#9CA3AF' } />
            )}
            <span className="text-[10px] font-medium tracking-wide"
                  style={{ color: active || featured ? '#C9A84C' : '#9CA3AF' }}>
                {label}
            </span>
        </Link>
    )
}

export default function BottomNav() {
    const { url } = usePage()
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16"
             style={{
                 background: 'rgba(249, 247, 242, 0.85)',
                 backdropFilter: 'blur(20px)',
                 WebkitBackdropFilter: 'blur(20px)',
                 borderTop: '0.5px solid rgba(201, 168, 76, 0.2)',
                 paddingBottom: 'env(safe-area-inset-bottom)',
             }}>
            {NAV_ITEMS.map(({ href, label, icon, match, featured }) => (
                <NavItem key={href} href={href} label={label} icon={icon}
                         active={match(url)} featured={featured} />
            ))}
        </nav>
    )
}
