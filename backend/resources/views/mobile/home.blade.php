@extends('app')

@section('content')

    <div class="w-full h-[100dvh] overflow-y-scroll snap-y snap-mandatory
            [-webkit-overflow-scrolling:touch]">

        {{-- ===== SLIDE 1 ===== --}}
        <div class="w-full h-[100dvh] snap-start snap-always relative shrink-0">
            <img src="{{ asset('images/tom.jpg') }}"
                 alt="Slide 1"
                 class="w-full h-full object-cover block">

            {{-- Gradient overlay --}}
            <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>

            {{-- Infos en bas à gauche --}}
            <div class="absolute bottom-24 left-5 right-20 z-10">
                <h2 class="text-white text-xl font-bold">Nike Air Max 90</h2>
                <p class="text-white/70 text-sm mt-1">Taille 43 — Très bon état</p>
                <span class="text-[#C9A84C] font-bold text-lg">25 000 FCFA</span>
            </div>

            {{-- Boutons latéraux TikTok --}}
            <div class="absolute right-4 bottom-28 flex flex-col items-center gap-6 z-20">

                {{-- Like --}}
                <button x-data="{ liked: false }"
                        @click="liked = !liked"
                        class="flex flex-col items-center">
                    <div class="w-11 h-11 rounded-full flex items-center justify-center
                            bg-white/20 backdrop-blur-sm
                            transition-all duration-300"
                         :class="liked ? 'bg-red-500/80 scale-110' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke-width="1.5" stroke="currentColor"
                             class="w-6 h-6 transition-all duration-300"
                             :class="liked ? 'text-white fill-white' : 'text-white'">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597
                              1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1
                              3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1"
                          x-text="liked ? '13' : '12'">12</span>
                </button>

                {{-- Chat --}}
                <a href="#" class="flex flex-col items-center">
                    <div class="w-11 h-11 rounded-full flex items-center justify-center
                            bg-white/20 backdrop-blur-sm
                            active:scale-95 transition-transform duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke-width="1.5" stroke="currentColor"
                             class="w-6 h-6 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1
                              .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0
                              .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375
                              0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21
                              12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0
                              1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969
                              5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93
                              16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9
                              3.694 9 8.25Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1">Chat</span>
                </a>

                {{-- Share --}}
                <button x-data
                        @click="navigator.share ? navigator.share({title: 'CampusShop', url: window.location.href}) : null"
                        class="flex flex-col items-center">
                    <div class="w-11 h-11 rounded-full flex items-center justify-center
                            bg-white/20 backdrop-blur-sm
                            active:scale-95 transition-transform duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke-width="1.5" stroke="currentColor"
                             class="w-6 h-6 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283
                              1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566
                              7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186
                              2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25
                              0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1">Share</span>
                </button>

            </div>

            {{-- Avatar vendeur --}}
            <div class="absolute right-4 bottom-56 z-20">
                <div class="w-10 h-10 rounded-full border-2 border-[#C9A84C] overflow-hidden">
                    <img src="{{ asset('images/tom.jpg') }}"
                         alt="Vendeur"
                         class="w-full h-full object-cover">
                </div>
            </div>
        </div>

        {{-- ===== SLIDE 2 ===== --}}
        <div class="w-full h-[100dvh] snap-start snap-always relative shrink-0">
            <img src="{{ asset('images/tom.jpg') }}"
                 alt="Slide 2"
                 class="w-full h-full object-cover block">

            <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>

            <div class="absolute bottom-24 left-5 right-20 z-10">
                <h2 class="text-white text-xl font-bold">MacBook Pro 2021</h2>
                <p class="text-white/70 text-sm mt-1">M1 Pro — 16GB RAM</p>
                <span class="text-[#C9A84C] font-bold text-lg">450 000 FCFA</span>
            </div>

            {{-- Boutons --}}
            <div class="absolute right-4 bottom-28 flex flex-col items-center gap-6 z-20">
                <button x-data="{ liked: false }" @click="liked = !liked" class="flex flex-col items-center">
                    <div
                        class="w-11 h-11 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm transition-all duration-300"
                        :class="liked ? 'bg-red-500/80 scale-110' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6 transition-all duration-300"
                             :class="liked ? 'text-white fill-white' : 'text-white'">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1" x-text="liked ? '6' : '5'">5</span>
                </button>
                <a href="#" class="flex flex-col items-center">
                    <div
                        class="w-11 h-11 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-95 transition-transform duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1">Chat</span>
                </a>
                <button class="flex flex-col items-center">
                    <div
                        class="w-11 h-11 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-95 transition-transform duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1">Share</span>
                </button>
            </div>

            <div class="absolute right-4 bottom-56 z-20">
                <div class="w-10 h-10 rounded-full border-2 border-[#C9A84C] overflow-hidden">
                    <img src="{{ asset('images/tom.jpg') }}" alt="Vendeur" class="w-full h-full object-cover">
                </div>
            </div>
        </div>

        {{-- ===== SLIDE 3 ===== --}}
        <div class="w-full h-[100dvh] snap-start snap-always relative shrink-0">
            <img src="{{ asset('images/tom.jpg') }}"
                 alt="Slide 3"
                 class="w-full h-full object-cover block">

            <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>

            <div class="absolute bottom-24 left-5 right-20 z-10">
                <h2 class="text-white text-xl font-bold">Calculatrice TI-84</h2>
                <p class="text-white/70 text-sm mt-1">Pour les cours de maths</p>
                <span class="text-[#C9A84C] font-bold text-lg">15 000 FCFA</span>
            </div>

            <div class="absolute right-4 bottom-28 flex flex-col items-center gap-6 z-20">
                <button x-data="{ liked: false }" @click="liked = !liked" class="flex flex-col items-center">
                    <div
                        class="w-11 h-11 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm transition-all duration-300"
                        :class="liked ? 'bg-red-500/80 scale-110' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6 transition-all duration-300"
                             :class="liked ? 'text-white fill-white' : 'text-white'">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1" x-text="liked ? '9' : '8'">8</span>
                </button>
                <a href="#" class="flex flex-col items-center">
                    <div
                        class="w-11 h-11 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-95 transition-transform duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1">Chat</span>
                </a>
                <button class="flex flex-col items-center">
                    <div
                        class="w-11 h-11 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-95 transition-transform duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1">Share</span>
                </button>
            </div>

            <div class="absolute right-4 bottom-56 z-20">
                <div class="w-10 h-10 rounded-full border-2 border-[#C9A84C] overflow-hidden">
                    <img src="{{ asset('images/tom.jpg') }}" alt="Vendeur" class="w-full h-full object-cover">
                </div>
            </div>
        </div>

        {{-- ===== SLIDE 4 ===== --}}
        <div class="w-full h-[100dvh] snap-start snap-always relative shrink-0">
            <img src="{{ asset('images/tom.jpg') }}"
                 alt="Slide 4"
                 class="w-full h-full object-cover block">

            <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent"></div>

            <div class="absolute bottom-24 left-5 right-20 z-10">
                <h2 class="text-white text-xl font-bold">Vélo Campus</h2>
                <p class="text-white/70 text-sm mt-1">Parfait pour les trajets</p>
                <span class="text-[#C9A84C] font-bold text-lg">35 000 FCFA</span>
            </div>

            <div class="absolute right-4 bottom-28 flex flex-col items-center gap-6 z-20">
                <button x-data="{ liked: false }" @click="liked = !liked" class="flex flex-col items-center">
                    <div
                        class="w-11 h-11 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm transition-all duration-300"
                        :class="liked ? 'bg-red-500/80 scale-110' : ''">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6 transition-all duration-300"
                             :class="liked ? 'text-white fill-white' : 'text-white'">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1" x-text="liked ? '4' : '3'">3</span>
                </button>
                <a href="#" class="flex flex-col items-center">
                    <div
                        class="w-11 h-11 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-95 transition-transform duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1">Chat</span>
                </a>
                <button class="flex flex-col items-center">
                    <div
                        class="w-11 h-11 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-95 transition-transform duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" class="w-6 h-6 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"/>
                        </svg>
                    </div>
                    <span class="text-white text-[11px] mt-1">Share</span>
                </button>
            </div>

            <div class="absolute right-4 bottom-56 z-20">
                <div class="w-10 h-10 rounded-full border-2 border-[#C9A84C] overflow-hidden">
                    <img src="{{ asset('images/tom.jpg') }}" alt="Vendeur" class="w-full h-full object-cover">
                </div>
            </div>
        </div>

    </div>

@endsection
