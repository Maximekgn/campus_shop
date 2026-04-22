<?php
/**
 * Scénario complet de test CampusShop - version corrigée
 */

$base = 'http://127.0.0.1:8000/api';

function apiCall($method, $url, $data = [], $token = null) {
    $ch = curl_init($url);
    $headers = ['Accept: application/json', 'Content-Type: application/json'];
    if ($token) $headers[] = "Authorization: Bearer $token";
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    if (!empty($data)) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['status' => $status, 'body' => json_decode($response, true), 'raw' => $response];
}

echo "===== SCENARIO COMPLET CAMPUSSHOP =====\n\n";
$allOk = true;

// STEP 1: Register/Login Alice
echo "--- STEP 1: Inscription alice@campus.edu ---\n";
$res = apiCall('POST', "$base/auth/register", [
    'name' => 'Alice Martin',
    'email' => 'alice2@campus.edu',
    'password' => 'password123',
    'password_confirmation' => 'password123',
    'student_id' => 'ALI2024',
]);
if ($res['status'] === 201) {
    echo "✅ Inscription réussie (HTTP 201) - Rôle: {$res['body']['user']['role']}\n";
    $aliceToken = $res['body']['token'];
} elseif ($res['status'] === 422) {
    echo "⚠️  Email déjà utilisé, connexion...\n";
    $loginRes = apiCall('POST', "$base/auth/login", ['email' => 'alice2@campus.edu', 'password' => 'password123']);
    if ($loginRes['status'] === 200) {
        $aliceToken = $loginRes['body']['token'];
        echo "✅ Connexion réussie\n";
    } else {
        echo "❌ Login échoué: " . $loginRes['raw'] . "\n"; exit(1);
    }
} else {
    echo "❌ Erreur HTTP {$res['status']}: " . $res['raw'] . "\n"; exit(1);
}

// STEP 2: Create listing
echo "\n--- STEP 2: Création annonce MacBook ---\n";
$res = apiCall('POST', "$base/listings", [
    'title' => 'MacBook Pro 13 pouces Test',
    'description' => 'MacBook Pro 13 pouces en très bon état, 8GB RAM, 256GB SSD.',
    'type' => 'vente',
    'price' => 650,
    'force_create' => true,
], $aliceToken);
if ($res['status'] === 201) {
    $listingId = $res['body']['listing']['id'];
    echo "✅ Annonce créée (ID: $listingId, statut: {$res['body']['listing']['status']})\n";
} else {
    echo "❌ Erreur HTTP {$res['status']}: " . $res['raw'] . "\n"; exit(1);
}

// STEP 3: Check my-listings
echo "\n--- STEP 3: Vérification 'Mes annonces' ---\n";
$res = apiCall('GET', "$base/my-listings", [], $aliceToken);
if ($res['status'] === 200) {
    $found = array_filter($res['body']['data'] ?? [], fn($l) => $l['id'] === $listingId);
    echo "✅ Mes annonces OK - MacBook présent: " . (!empty($found) ? "✅ OUI" : "❌ NON") . "\n";
    if (!empty($found)) {
        $l = array_values($found)[0];
        echo "   Statut: {$l['status']}\n";
    }
} else {
    echo "❌ Erreur HTTP {$res['status']}\n"; $allOk = false;
}

// STEP 4: Login as moderator
echo "\n--- STEP 4: Connexion modérateur ---\n";
$res = apiCall('POST', "$base/auth/login", ['email' => 'moderateur@campus.edu', 'password' => 'password']);
if ($res['status'] === 200) {
    $modToken = $res['body']['token'];
    echo "✅ Connexion réussie - Rôle: {$res['body']['user']['role']}\n";
} else {
    echo "❌ Erreur HTTP {$res['status']}: " . $res['raw'] . "\n"; exit(1);
}

// STEP 5: Check pending listings
echo "\n--- STEP 5a: Annonces en attente ---\n";
$res = apiCall('GET', "$base/moderation/pending", [], $modToken);
if ($res['status'] === 200) {
    $count = count($res['body']['data'] ?? []);
    $found = array_filter($res['body']['data'] ?? [], fn($l) => $l['id'] === $listingId);
    echo "✅ File d'attente: $count annonce(s) - MacBook présent: " . (!empty($found) ? "✅" : "❌") . "\n";
} else {
    echo "❌ Erreur HTTP {$res['status']}: " . $res['raw'] . "\n"; $allOk = false;
}

// STEP 5b: Approve the listing via moderation route (POST spoofing PUT)
echo "\n--- STEP 5b: Validation de l'annonce ---\n";
$res = apiCall('POST', "$base/moderation/listings/$listingId/approve", ['_method' => 'PUT'], $modToken);
if ($res['status'] === 200) {
    echo "✅ Annonce approuvée - Statut: {$res['body']['listing']['status']}\n";
} else {
    echo "❌ Erreur HTTP {$res['status']}: " . $res['raw'] . "\n"; $allOk = false;
}

// STEP 6: Login as buyer
echo "\n--- STEP 6: Connexion acheteur jean@campus.edu ---\n";
$res = apiCall('POST', "$base/auth/login", ['email' => 'jean@campus.edu', 'password' => 'password']);
if ($res['status'] === 200) {
    $jeanToken = $res['body']['token'];
    echo "✅ Connexion réussie\n";
} else {
    echo "❌ Erreur HTTP {$res['status']}: " . $res['raw'] . "\n"; exit(1);
}

// STEP 7: Check public listings
echo "\n--- STEP 7: Annonces publiques ---\n";
$res = apiCall('GET', "$base/listings", [], $jeanToken);
if ($res['status'] === 200) {
    $total = $res['body']['total'] ?? 0;
    $found = array_filter($res['body']['data'] ?? [], fn($l) => $l['id'] === $listingId);
    echo "✅ Annonces: $total résultat(s) - MacBook visible: " . (!empty($found) ? "✅ OUI" : "❌ NON (peut être en modération)") . "\n";
} else {
    echo "❌ Erreur HTTP {$res['status']}\n"; $allOk = false;
}

// STEP 8: Add to favorites
echo "\n--- STEP 8: Ajout aux favoris ---\n";
$res = apiCall('POST', "$base/listings/$listingId/favorite", [], $jeanToken);
if (in_array($res['status'], [200, 201])) {
    $action = $res['body']['favorited'] ?? $res['body']['message'] ?? '';
    echo "✅ Favori (HTTP {$res['status']}): $action\n";
} else {
    echo "❌ Erreur HTTP {$res['status']}: " . $res['raw'] . "\n"; $allOk = false;
}

// STEP 9: Start conversation
echo "\n--- STEP 9: Démarrage d'une conversation ---\n";
$res = apiCall('POST', "$base/conversations", ['listing_id' => $listingId], $jeanToken);
if (in_array($res['status'], [200, 201])) {
    $convId = $res['body']['conversation']['id'] ?? $res['body']['id'];
    echo "✅ Conversation créée (ID: $convId)\n";
} else {
    echo "❌ Erreur HTTP {$res['status']}: " . $res['raw'] . "\n"; exit(1);
}

// STEP 10: Exchange messages
echo "\n--- STEP 10: Échange de messages ---\n";
foreach ([
    [$jeanToken, "Bonjour, l'article est-il toujours disponible ?"],
    [$aliceToken, "Oui ! Le MacBook est en parfait état, disponible immédiatement."],
    [$jeanToken, "Super ! Je confirme mon achat, prix ok pour moi !"],
] as $i => [$token, $msg]) {
    $r = apiCall('POST', "$base/conversations/$convId/messages", ['body' => $msg], $token);
    $who = $token === $jeanToken ? "Jean" : "Alice";
    echo (in_array($r['status'], [200, 201]) ? "✅" : "❌") . " Message " . ($i+1) . " ($who): HTTP {$r['status']}\n";
    if (!in_array($r['status'], [200, 201])) { echo "   " . $r['raw'] . "\n"; $allOk = false; }
}

// STEP 11: Check reports for moderator
echo "\n--- STEP 11: Signalements (modérateur) ---\n";
$res = apiCall('GET', "$base/moderation/reports", [], $modToken);
if ($res['status'] === 200) {
    $count = $res['body']['total'] ?? count($res['body']['data'] ?? $res['body']);
    echo "✅ Signalements: $count rapport(s) accessible(s)\n";
} else {
    echo "❌ Erreur HTTP {$res['status']}: " . $res['raw'] . "\n"; $allOk = false;
}

echo "\n" . str_repeat("=", 40) . "\n";
echo $allOk ? "✅ SCÉNARIO COMPLET RÉUSSI\n" : "⚠️  SCÉNARIO TERMINÉ AVEC DES ERREURS\n";
?>
