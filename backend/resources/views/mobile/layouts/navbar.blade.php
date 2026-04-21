<nav x-data="navbar()"
     class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16"
     style="
        background: rgba(249, 247, 242, 0.72);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-top: 0.5px solid rgba(201, 168, 76, 0.18);
        padding-bottom: env(safe-area-inset-bottom);
     ">

    {{-- ACCUEIL --}}
    <a href="/mobile"
       @click="setActive('accueil')"
       class="flex flex-col items-center gap-1 transition-all duration-300 ease-out relative"
       x-bind:class="isActive('accueil')
           ? 'text-[#C9A84C] scale-110 -translate-y-1'
           : 'text-[#B0ADA8] scale-100 translate-y-0'">
        <span class="absolute -top-0.5 w-8 h-0.5 rounded-full bg-[#C9A84C] transition-all duration-300"
              x-bind:class="isActive('accueil') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"></span>
        <div x-bind:class="isActive('accueil') ? 'animate-bounce-once' : ''">
            <x-heroicon-o-home class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-medium"
              x-bind:class="isActive('accueil') ? 'opacity-100' : 'opacity-70'">Accueil</span>
    </a>

    {{-- RECHERCHE --}}
    <a href="/mobile/search"
       @click="setActive('recherche')"
       class="flex flex-col items-center gap-1 transition-all duration-300 ease-out relative"
       x-bind:class="isActive('recherche')
           ? 'text-[#C9A84C] scale-110 -translate-y-1'
           : 'text-[#B0ADA8] scale-100 translate-y-0'">
        <span class="absolute -top-0.5 w-8 h-0.5 rounded-full bg-[#C9A84C] transition-all duration-300"
              x-bind:class="isActive('recherche') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"></span>
        <div x-bind:class="isActive('recherche') ? 'animate-bounce-once' : ''">
            <x-heroicon-o-magnifying-glass class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-medium"
              x-bind:class="isActive('recherche') ? 'opacity-100' : 'opacity-70'">Recherche</span>
    </a>

    {{-- POSTER --}}
    <a href="/mobile/listings/create"
       @click="setActive('poster')"
       class="flex flex-col items-center gap-1 relative">
        <div class="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center -mt-5 shadow-md
                    transition-all duration-300 ease-out relative"
             x-bind:class="isActive('poster') ? 'scale-110 shadow-lg shadow-[#C9A84C]/30' : 'scale-100'">
            <span class="absolute inset-0 rounded-full bg-[#C9A84C] animate-ping opacity-20"
                  x-show="isActive('poster')" x-transition></span>
            <div class="relative z-10 transition-transform duration-300"
                 x-bind:class="isActive('poster') ? 'rotate-45' : 'rotate-0'">
                <x-heroicon-o-plus class="w-6 h-6 text-white" />
            </div>
        </div>
        <span class="text-[10px] font-medium transition-all duration-300"
              x-bind:class="isActive('poster') ? 'text-[#C9A84C]' : 'text-[#B0ADA8]'">Poster</span>
    </a>

    {{-- MESSAGES --}}
    <a href="/mobile/conversations"
       @click="setActive('messages')"
       class="flex flex-col items-center gap-1 transition-all duration-300 ease-out relative"
       x-bind:class="isActive('messages')
           ? 'text-[#C9A84C] scale-110 -translate-y-1'
           : 'text-[#B0ADA8] scale-100 translate-y-0'">
        <span class="absolute -top-0.5 w-8 h-0.5 rounded-full bg-[#C9A84C] transition-all duration-300"
              x-bind:class="isActive('messages') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"></span>
        <div class="relative">
            <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[8px]
                         flex items-center justify-center animate-pulse"
                  x-show="unreadCount > 0" x-text="unreadCount" x-transition></span>
            <x-heroicon-o-chat-bubble-left-right class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-medium"
              x-bind:class="isActive('messages') ? 'opacity-100' : 'opacity-70'">Messages</span>
    </a>

    {{-- PROFILE --}}
    <a href="/mobile/profile"
       @click="setActive('profile')"
       class="flex flex-col items-center gap-1 transition-all duration-300 ease-out relative"
       x-bind:class="isActive('profile')
           ? 'text-[#C9A84C] scale-110 -translate-y-1'
           : 'text-[#B0ADA8] scale-100 translate-y-0'">
        <span class="absolute -top-0.5 w-8 h-0.5 rounded-full bg-[#C9A84C] transition-all duration-300"
              x-bind:class="isActive('profile') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'"></span>
        <div x-bind:class="isActive('profile') ? 'animate-bounce-once' : ''">
            <x-heroicon-o-user class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-medium"
              x-bind:class="isActive('profile') ? 'opacity-100' : 'opacity-70'">Profile</span>
    </a>
</nav>

{{-- Script Alpine --}}
<script>
    function navbar() {
        const path = window.location.pathname;
        let currentTab = 'accueil';
        if (path.includes('/search'))               currentTab = 'recherche';
        else if (path.includes('/listings/create')) currentTab = 'poster';
        else if (path.includes('/conversations'))   currentTab = 'messages';
        else if (path.includes('/profile'))         currentTab = 'profile';

        return {
            active: currentTab,
            unreadCount: 3,
            setActive(tab) { this.active = tab; },
            isActive(tab) { return this.active === tab; }
        }
    }
</script>
