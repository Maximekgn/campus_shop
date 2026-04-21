@extends('mobile.layouts.app')

@section('content')
<div style="padding: 20px;">
    <h1 style="font-size: 22px; font-weight: 600; margin-bottom: 16px;">CampusShop</h1>
    <p style="color: #7A7572;">Les annonces arrivent ici... joan ok</p>
    <div x-data="{ ouvert: false }">

        <button @click="ouvert = !ouvert" class="bg-[#C9A84C] text-white px-4 py-2 rounded-xl">
            Tester Alpine
        </button>
        <div x-show="ouvert" x-transition class="mt-2 p-3 bg-white rounded-xl">
            Alpine fonctionne !
        </div>

    </div>
</div>
@endsection
