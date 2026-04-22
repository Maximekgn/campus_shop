<?php
$base = 'http://127.0.0.1:8000/api';

function call($method, $url, $data, $token) {
    $ch = curl_init($url);
    $h = ['Accept: application/json', 'Content-Type: application/json'];
    if ($token) $h[] = "Authorization: Bearer $token";
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $h);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $r = curl_exec($ch);
    $s = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$s, json_decode($r, true), $r];
}

// Step 1: Login mod
[$s, $b] = call('POST', "$base/auth/login", ['email'=>'moderateur@campus.edu','password'=>'password'], null);
echo "Mod login: HTTP $s, role: {$b['user']['role']}\n";
$tok = $b['token'];

// Step 2: pending listings
[$s, $b, $r] = call('GET', "$base/moderation/pending", null, $tok);
echo "Pending: HTTP $s\n";
if ($s !== 200) { echo substr($r, 0, 300) . "\n"; }
else echo "Count: " . count($b['data'] ?? []) . "\n";

// Step 3: Test approve a listing
[$s2, $b2] = call('POST', "$base/auth/login", ['email'=>'alice2@campus.edu','password'=>'password123'], null);
$aToken = $b2['token'];
[$s3, $b3] = call('POST', "$base/listings", ['title'=>'Test Approve Listing','description'=>'Test desc pour approve','type'=>'don','force_create'=>true], $aToken);
$lid = $b3['listing']['id'];
echo "Created listing ID: $lid, status: {$b3['listing']['status']}\n";

[$s4, $b4, $r4] = call('PUT', "$base/moderation/listings/$lid/approve", null, $tok);
echo "Approve: HTTP $s4\n";
if ($s4 !== 200) echo substr($r4, 0, 500) . "\n";
else {
    echo "Body: $r4\n";
    echo "Status after: " . ($b4['listing']['status'] ?? 'null') . "\n";
}

// Step 4: test reports
[$s5, $b5, $r5] = call('GET', "$base/moderation/reports", null, $tok);
echo "Reports: HTTP $s5\n";
if ($s5 !== 200) echo substr($r5, 0, 300) . "\n";
else echo "Reports count: " . ($b5['total'] ?? count($b5['data'] ?? [])) . "\n";
?>
