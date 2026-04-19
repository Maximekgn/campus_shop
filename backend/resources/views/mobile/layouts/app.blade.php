<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>CampusShop</title>
    @vite(['resources/css/app.css','resources/js/app.js'])
    <style>
        body {
            padding-top: env(safe-area-inset-top);
        }
    </style>
</head>
<body class="bg-[#F9F7F2] text-[#1A1A1A] font-sans">

    <div class="pb-20">
        @yield('content')
    </div>

    @include('mobile.layouts.navbar')

</body>
</html>
