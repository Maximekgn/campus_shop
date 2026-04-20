<nav class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16"
     style="
        background: rgba(249, 247, 242, 0.72);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-top: 0.5px solid rgba(201, 168, 76, 0.18);
        padding-bottom: env(safe-area-inset-bottom);
     ">

    {{-- Accueil --}}
    <a href="/mobile"
       class="flex flex-col items-center gap-1 no-underline {{ request()->is('mobile') && !request()->is('mobile/*') ? 'text-[#C9A84C]' : 'text-[#B0ADA8]' }}">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span class="text-[10px] font-medium">Accueil</span>
    </a>

    {{-- Recherche --}}
    <a href="/mobile/search"
       class="flex flex-col items-center gap-1 no-underline {{ request()->is('mobile/search') ? 'text-[#C9A84C]' : 'text-[#B0ADA8]' }}">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span class="text-[10px] font-medium">Recherche</span>
    </a>

    {{-- Poster --}}
    <a href="/mobile/listings/create"
       class="flex flex-col items-center gap-1 no-underline {{ request()->is('mobile/listings/create') ? 'text-[#C9A84C]' : 'text-[#B0ADA8]' }}">
        <div class="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center -mt-5 shadow-md">
            <svg class="w-6 h-6" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
        </div>
        <span class="text-[10px] font-medium">Poster</span>
    </a>

    {{-- Messages --}}
    <a href="/mobile/conversations"
       class="flex flex-col items-center gap-1 no-underline {{ request()->is('mobile/conversations*') ? 'text-[#C9A84C]' : 'text-[#B0ADA8]' }}">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        <span class="text-[10px] font-medium">Messages</span>
    </a>

    {{-- Profil --}}
    <a href="/mobile/profile"
       class="flex flex-col items-center gap-1 no-underline {{ request()->is('mobile/profile*') ? 'text-[#C9A84C]' : 'text-[#B0ADA8]' }}">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
        <span class="text-[10px] font-medium">Profil</span>
    </a>

</nav>
