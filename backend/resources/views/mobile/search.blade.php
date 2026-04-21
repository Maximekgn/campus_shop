@extends('app')

@section('content')
    <div class="p-4">
        <h1 class="text-xl font-semibold mb-4">Recherche</h1>

        <div class="relative mb-4">
            <input
                type="text"
                placeholder="Rechercher une annonce..."
                class="w-full bg-white border border-[#E8E4DC] rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#C9A84C]"
            />
            <svg class="absolute left-3 top-3.5 w-4 h-4 text-[#B0ADA8]" fill="none" stroke="currentColor"
                 stroke-width="1.8" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
        </div>

        <p class="text-[#7A7572] text-sm">Tape quelque chose pour rechercher...</p>
    </div>
@endsection
