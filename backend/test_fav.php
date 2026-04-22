<?php
$base = 'http://127.0.0.1:8000/api';
function call($m, $u, $d, $t) {
    $ch = curl_init($u);
    $h = ['Accept: application/json'];
    if ($t) $h[] = "Authorization: Bearer $t";
    if ($d) { $h[] = 'Content-Type: application/json'; curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($d)); }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $h);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $m);
    $r = curl_exec($ch); $s = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    return [$s, json_decode($r, true), $r];
}

$r1 = call('POST', "$base/auth/login", ['email'=>'jean@campus.edu','password'=>'password'], null);
$t = $r1[1]['token'];
echo "login: {$r1[0]}\n";

$r2 = call('GET', "$base/listings", null, null);
if (empty($r2[1]['data'])) { echo "No active listings.\n"; return; }
$lid = $r2[1]['data'][0]['id'];
echo "toggling fav for listing $lid\n";
$r3 = call('POST', "$base/listings/$lid/favorite", null, $t);
echo "toggle: {$r3[0]} - " . ($r3[1]['message']??'') . "\n";

$r4 = call('GET', "$base/favorites", null, $t);
echo "favorites: {$r4[0]}\n";
$favCount = count($r4[1]['data'] ?? []);
echo "We have $favCount favs. \n";
if ($r4[0] !== 200) echo substr($r4[2], 0, 500);
