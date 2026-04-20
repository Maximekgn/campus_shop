<?php

$baseUrl = 'http://localhost:8000/api';

/**
 * Fonction pour exécuter une requête cURL
 */
function runTest($name, $method, $url, $data = null, $token = null) {
    echo "========================================\n";
    echo "Test : $name\n";
    echo "Requête : $method $url\n";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    // Pour éviter les soucis SSL en local
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
    
    $headers = [
        'Accept: application/json',
        'Content-Type: application/json'
    ];
    
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    if ($data !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        echo "❌ ERREUR cURL : " . curl_error($ch) . "\n";
        echo "Assure-toi que 'php artisan serve' tourne sur le port 8000 !\n";
        exit;
    }
    
    curl_close($ch);
    
    $json = json_decode($response, true);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        echo "✅ SUCCÈS (Code $httpCode)\n";
    } else {
        echo "❌ ERREUR (Code $httpCode)\n";
    }
    
    echo "Réponse : " . json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
    
    return [
        'code' => $httpCode,
        'data' => $json
    ];
}

// Variables de test
$email = 'tester_' . time() . '@example.com';
$password = 'password123';

echo "DÉMARRAGE DES TESTS AUTOMATISÉS DE L'API CAMPUS_SHOP\n";
echo "Veuillez vous assurer que le serveur est démarré avec 'php artisan serve'\n\n";

// ---------------------------------------------------------
// 1. Inscription d'un nouvel utilisateur
// ---------------------------------------------------------
$registerRes = runTest("1. Inscription", "POST", "$baseUrl/auth/register", [
    'name' => 'Utilisateur Test',
    'email' => $email,
    'password' => $password,
    'password_confirmation' => $password
]);

$token = null;
if ($registerRes['code'] === 201) {
    $token = $registerRes['data']['token'] ?? null;
}

if (!$token) {
    echo "❌ Impossible de récupérer le token. Arrêt des tests.\n";
    exit;
}

// ---------------------------------------------------------
// 2. Récupération du profil (Authentifié)
// ---------------------------------------------------------
runTest("2. Récupérer le profil utilisateur", "GET", "$baseUrl/auth/me", null, $token);

// ---------------------------------------------------------
// 3. Modifier le profil
// ---------------------------------------------------------
runTest("3. Modifier le profil", "PUT", "$baseUrl/auth/me", [
    'name' => 'Utilisateur Modifié',
    'student_id' => 'STU-999'
], $token);

// ---------------------------------------------------------
// 4. Récupération des annonces publiques
// ---------------------------------------------------------
runTest("4. Récupérer toutes les annonces (public)", "GET", "$baseUrl/listings");

// ---------------------------------------------------------
// 5. Déconnexion
// ---------------------------------------------------------
runTest("5. Déconnexion", "POST", "$baseUrl/auth/logout", null, $token);

echo "========================================\n";
echo "TESTS BÂSIQUES TERMINÉS 🎉\n";
echo "Note : La création d'annonce nécessite souvent un email vérifié, elle n'est donc pas testée ici pour garder le script simple.\n";
