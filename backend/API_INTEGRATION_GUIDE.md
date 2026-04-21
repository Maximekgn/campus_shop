# 📖 Guide Complet d'Intégration API — CampusShop

> **Destinataires :** Développeurs Frontend (Web / Mobile)  
> **Base URL :** `http://localhost:8000` (dev) — à remplacer par l'URL de production  
> **Format :** Toutes les réponses sont en `application/json`  
> **Authentification :** Laravel Sanctum — Bearer Token

---

## Table des matières

1. [Démarrage rapide](#1-démarrage-rapide)
2. [Authentification](#2-authentification)
3. [Gestion des Annonces](#3-gestion-des-annonces)
4. [Photos des Annonces](#4-photos-des-annonces)
5. [Messagerie](#5-messagerie)
6. [Favoris](#6-favoris)
7. [Signalements](#7-signalements)
8. [Profil Vendeur Public](#8-profil-vendeur-public)
9. [Modération (Rôle Admin)](#9-modération-rôle-admin)
10. [Codes d'erreur globaux](#10-codes-derreur-globaux)
11. [Exemples de code prêts à l'emploi](#11-exemples-de-code-prêts-à-lemploi)

---

## 1. Démarrage rapide

### Configuration de base (à faire une seule fois)

```javascript
// config/api.js
const API_BASE = 'http://localhost:8000/api';

/**
 * Fonction centrale pour tous les appels API.
 * Injecte automatiquement le token et gère les erreurs globales.
 */
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('campus_token'); // ou votre solution de stockage

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // Gestion globale des erreurs
    if (response.status === 401) {
      // Token expiré ou invalide → rediriger vers login
      localStorage.removeItem('campus_token');
      window.location.href = '/login';
    }
    if (response.status === 403) {
      // Compte banni ou accès refusé
      console.error('Accès refusé :', data.message);
    }
    throw { status: response.status, data };
  }

  return data;
}
```

### Headers obligatoires sur toutes les requêtes

| Header | Valeur | Obligatoire |
|---|---|---|
| `Accept` | `application/json` | ✅ Toujours |
| `Content-Type` | `application/json` | ✅ Pour POST/PUT |
| `Authorization` | `Bearer {token}` | ✅ Sur les routes protégées |

> ⚠️ **Important :** Sans `Accept: application/json`, Laravel retourne du HTML en cas d'erreur au lieu du JSON.

---

## 2. Authentification

### 2.1 Inscription

**`POST /api/auth/register`** — Pas de token requis

**Corps de la requête :**
```json
{
  "name": "Alice Martin",
  "email": "alice@universite.fr",
  "password": "MonMotDePasse123",
  "password_confirmation": "MonMotDePasse123",
  "student_id": "ETU-2024-001"
}
```

| Champ | Type | Requis | Règles |
|---|---|---|---|
| `name` | string | ✅ | max 255 caractères |
| `email` | string | ✅ | Format email, unique |
| `password` | string | ✅ | Min 8 caractères |
| `password_confirmation` | string | ✅ | Doit correspondre à `password` |
| `student_id` | string | ❌ | Numéro étudiant, max 50 caractères |

**Réponse `201 Created` :**
```json
{
  "message": "Inscription réussie. Veuillez vérifier votre email.",
  "user": {
    "id": 1,
    "name": "Alice Martin",
    "email": "alice@universite.fr",
    "role": "membre",
    "student_id": "ETU-2024-001",
    "is_active": true,
    "created_at": "2025-01-15T10:00:00.000000Z"
  },
  "token": "1|aBcDeF12GhIjKl..."
}
```

> 📌 **À faire côté front :** Stocker le `token` reçu et le `user`. Un email de vérification est envoyé automatiquement. Certaines actions (créer une annonce) nécessitent que l'email soit vérifié.

---

### 2.2 Connexion

**`POST /api/auth/login`** — Pas de token requis

**Corps de la requête :**
```json
{
  "email": "alice@universite.fr",
  "password": "MonMotDePasse123"
}
```

**Réponse `200 OK` :**
```json
{
  "message": "Connexion réussie.",
  "user": {
    "id": 1,
    "name": "Alice Martin",
    "email": "alice@universite.fr",
    "role": "membre",
    "is_active": true,
    "last_seen_at": "2025-01-15T10:05:00.000000Z"
  },
  "token": "2|XyZwVu98TsRqPo..."
}
```

**Erreur `401 Unauthorized` — Mauvais identifiants :**
```json
{
  "message": "Identifiants incorrects."
}
```

**Erreur `403 Forbidden` — Compte banni :**
```json
{
  "message": "Votre compte est temporairement suspendu.",
  "ban_until": "2025-02-01T00:00:00+00:00"
}
```

> 📌 **À faire côté front :** En cas de `403`, afficher la date `ban_until` formatée à l'utilisateur.

---

### 2.3 Déconnexion

**`POST /api/auth/logout`** — 🔒 Token requis

**Réponse `200 OK` :**
```json
{
  "message": "Déconnexion réussie."
}
```

> 📌 **À faire côté front :** Supprimer le token du stockage local après cette réponse.

---

### 2.4 Profil de l'utilisateur connecté

**`GET /api/auth/me`** — 🔒 Token requis

**Réponse `200 OK` :**
```json
{
  "user": {
    "id": 1,
    "name": "Alice Martin",
    "email": "alice@universite.fr",
    "role": "membre",
    "student_id": "ETU-2024-001",
    "is_active": true,
    "email_verified_at": "2025-01-15T10:10:00.000000Z",
    "last_seen_at": "2025-01-15T11:00:00.000000Z",
    "ban_until": null
  }
}
```

---

### 2.5 Mettre à jour son profil

**`PUT /api/auth/me`** — 🔒 Token requis

**Corps de la requête (tous les champs sont optionnels) :**
```json
{
  "name": "Alice M.",
  "student_id": "ETU-2024-002"
}
```

**Réponse `200 OK` :**
```json
{
  "message": "Profil mis à jour.",
  "user": { "...profil mis à jour..." }
}
```

---

## 3. Gestion des Annonces

### Valeurs possibles des champs

| Champ | Valeurs possibles |
|---|---|
| `type` | `"vente"`, `"don"`, `"echange"` |
| `status` | `"draft"` (brouillon, en attente de modération), `"publiee"` (visible), `"reservee"`, `"vendue"`, `"archivee"` |

---

### 3.1 Lister les annonces publiques

**`GET /api/listings`** — Pas de token requis

**Paramètres de requête (tous optionnels) :**

| Paramètre | Type | Description | Exemple |
|---|---|---|---|
| `q` | string | Recherche plein texte (titre + description) | `?q=guitare` |
| `type` | string | Filtrer par type | `?type=vente` |
| `categories` | string | Slugs séparés par des virgules | `?categories=livres,musique` |
| `price_min` | number | Prix minimum | `?price_min=10` |
| `price_max` | number | Prix maximum | `?price_max=50` |
| `sort` | string | Tri : `recent`, `price_asc`, `price_desc`, `popular` | `?sort=price_asc` |
| `per_page` | number | Résultats par page (défaut: 15) | `?per_page=20` |

**Exemple d'appel :**
```
GET /api/listings?q=guitare&type=vente&sort=price_asc&per_page=10
```

**Réponse `200 OK` (pagination Laravel) :**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 42,
      "user_id": 1,
      "title": "Guitare acoustique",
      "description": "Très bon état, peu utilisée.",
      "type": "vente",
      "price": "45.00",
      "status": "publiee",
      "views_count": 128,
      "created_at": "2025-01-10T09:00:00.000000Z",
      "updated_at": "2025-01-10T09:00:00.000000Z",
      "user": {
        "id": 1,
        "name": "Alice Martin"
      },
      "photos": [
        {
          "id": 5,
          "listing_id": 42,
          "path": "listings/42/photo.jpg",
          "order": 1
        }
      ]
    }
  ],
  "first_page_url": "http://localhost:8000/api/listings?page=1",
  "last_page": 5,
  "last_page_url": "http://localhost:8000/api/listings?page=5",
  "next_page_url": "http://localhost:8000/api/listings?page=2",
  "per_page": 15,
  "total": 73
}
```

> 📌 **Photos :** Le champ `path` est un chemin relatif. Pour construire l'URL complète de l'image :
> ```javascript
> const imageUrl = `http://localhost:8000/storage/${photo.path}`;
> ```

---

### 3.2 Voir le détail d'une annonce

**`GET /api/listings/{id}`** — Pas de token requis (optionnel pour `is_favorited`)

> ✨ **Comportement automatique :** Chaque appel à cette route incrémente le `views_count` de l'annonce.

**Réponse `200 OK` :**
```json
{
  "listing": {
    "id": 42,
    "user_id": 1,
    "title": "Guitare acoustique",
    "description": "Très bon état, peu utilisée.",
    "type": "vente",
    "price": "45.00",
    "status": "publiee",
    "views_count": 129,
    "user": {
      "id": 1,
      "name": "Alice Martin",
      "email": "alice@universite.fr"
    },
    "photos": [ { "id": 5, "path": "listings/42/photo.jpg", "order": 1 } ],
    "categories": [
      { "id": 3, "name": "Musique", "slug": "musique", "icon": "🎵" }
    ],
    "price_histories": [
      {
        "id": 1,
        "listing_id": 42,
        "old_price": "60.00",
        "new_price": "45.00",
        "created_at": "2025-01-12T14:00:00.000000Z"
      }
    ]
  },
  "is_favorited": false
}
```

> 📌 **`price_histories` :** Historique complet des variations de prix. Utiliser pour afficher un badge "Prix réduit !" si la dernière entrée a `new_price < old_price`.

---

### 3.3 Créer une annonce

**`POST /api/listings`** — 🔒 Token requis + Email vérifié

**Corps de la requête :**
```json
{
  "title": "Calculatrice Texas Instruments TI-84",
  "description": "En parfait état, batterie neuve, housse incluse.",
  "type": "vente",
  "price": 25.00,
  "categories": [1, 3]
}
```

| Champ | Type | Requis | Règles |
|---|---|---|---|
| `title` | string | ✅ | max 255 caractères |
| `description` | string | ✅ | |
| `type` | string | ✅ | `vente`, `don`, `echange` |
| `price` | number | ⚠️ | Obligatoire si `type=vente`. Interdit si `type=don`. |
| `categories` | array d'IDs | ❌ | IDs de catégories existantes |
| `force_create` | boolean | ❌ | `true` pour forcer si doublon détecté |

**Réponse `201 Created` :**
```json
{
  "message": "Annonce créée avec succès. Elle sera visible après validation par un modérateur.",
  "listing": {
    "id": 43,
    "title": "Calculatrice Texas Instruments TI-84",
    "status": "draft",
    "photos": [],
    "categories": [ { "id": 1, "name": "Electronique", "slug": "electronique" } ]
  }
}
```

#### ⚠️ Gestion du doublon (statut `409 Conflict`)

Si l'utilisateur a déjà une annonce avec des mots-clés similaires, l'API retourne :

```json
{
  "message": "Vous avez peut-être déjà posté cet article.",
  "duplicate_suggestion": {
    "id": 40,
    "title": "Calculatrice TI-84 à vendre",
    "status": "publiee"
  },
  "prompt": "Envoyez \"force_create\" à true pour publier quand même."
}
```

**À faire côté front :** Afficher un dialogue de confirmation à l'utilisateur avec l'annonce similaire trouvée, avec deux boutons :
- "Voir mon annonce existante" → rediriger vers `duplicate_suggestion.id`
- "Publier quand même" → relancer la requête avec `{ ...données, force_create: true }`

---

### 3.4 Modifier une annonce

**`PUT /api/listings/{id}`** — 🔒 Token requis (propriétaire uniquement)

**Corps de la requête (tous les champs sont optionnels) :**
```json
{
  "title": "Guitare acoustique — prix négociable",
  "price": 40.00
}
```

> ✨ **Historique des prix automatique :** Si `price` change, un Observer côté backend enregistre automatiquement l'ancien et le nouveau prix dans `price_histories`. Aucune action requise du front.

**Réponse `200 OK` :**
```json
{
  "message": "Annonce mise à jour.",
  "listing": { "...annonce mise à jour..." }
}
```

**Erreur `403 Forbidden` :** L'utilisateur n'est pas le propriétaire.

---

### 3.5 Supprimer une annonce

**`DELETE /api/listings/{id}`** — 🔒 Token requis (propriétaire uniquement)

**Réponse `200 OK` :**
```json
{
  "message": "Annonce supprimée."
}
```

---

### 3.6 Changer le statut d'une annonce

**`PUT /api/listings/{id}/status`** — 🔒 Token requis (propriétaire uniquement)

Utilisé par le propriétaire pour marquer son annonce comme réservée ou vendue.

**Corps de la requête :**
```json
{
  "status": "vendue"
}
```

**Transitions autorisées :**

| Statut actuel | Peut passer à |
|---|---|
| `publiee` | `reservee`, `vendue` |
| `reservee` | `publiee`, `vendue` |

**Réponse `200 OK` :**
```json
{
  "message": "Statut mis à jour.",
  "listing": { "...annonce avec nouveau statut..." }
}
```

---

### 3.7 Mes annonces (tableau de bord utilisateur)

**`GET /api/my-listings`** — 🔒 Token requis

Retourne **toutes** les annonces de l'utilisateur connecté, quel que soit leur statut (draft, publiée, archivée, etc.).

**Paramètres de requête optionnels :**
- `per_page` — défaut 15

**Réponse `200 OK` :** Même structure paginée que `/api/listings`.

---

## 4. Photos des Annonces

### 4.1 Uploader des photos

**`POST /api/listings/{id}/photos`** — 🔒 Token requis (propriétaire)  
**Content-Type :** `multipart/form-data` ⚠️ (**PAS** `application/json`)

**Corps de la requête :**
```
photos[]: [fichier image 1]
photos[]: [fichier image 2]
```

| Contrainte | Valeur |
|---|---|
| Formats acceptés | JPEG, PNG, WebP |
| Taille max par photo | 1 Mo (1024 ko) |
| Maximum total par annonce | 3 photos |

**Réponse `201 Created` :**
```json
{
  "message": "2 photo(s) uploadée(s) avec succès.",
  "photos": [
    { "id": 10, "listing_id": 43, "path": "listings/43/abc123.jpg", "order": 1 },
    { "id": 11, "listing_id": 43, "path": "listings/43/def456.webp", "order": 2 }
  ]
}
```

**Erreur `422` — Dépassement du quota :**
```json
{
  "message": "Maximum 3 photos par annonce. Vous en avez déjà 2.",
  "current_count": 2,
  "max": 3
}
```

**Exemple JavaScript avec `FormData` :**
```javascript
async function uploadPhotos(listingId, files) {
  const token = localStorage.getItem('campus_token');
  const formData = new FormData();
  files.forEach(file => formData.append('photos[]', file));

  const response = await fetch(`http://localhost:8000/api/listings/${listingId}/photos`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      // ⚠️ NE PAS mettre Content-Type ici, le navigateur le gère automatiquement avec le boundary
    },
    body: formData,
  });
  return response.json();
}
```

---

### 4.2 Supprimer une photo

**`DELETE /api/listings/{listing_id}/photos/{photo_id}`** — 🔒 Token requis (propriétaire)

**Réponse `200 OK` :**
```json
{
  "message": "Photo supprimée."
}
```

> ✨ L'ordre des photos restantes est automatiquement recalculé côté serveur.

---

## 5. Messagerie

> 🔒 Toutes les routes de messagerie nécessitent un token.

### Flux typique d'une conversation

```
1. Acheteur clique "Contacter le vendeur" sur une annonce
   → POST /api/conversations { listing_id: 42 }
   → Reçoit conversation_id

2. Acheteur envoie un message
   → POST /api/conversations/{id}/messages { body: "Bonjour, est-ce disponible ?" }

3. Application affiche la liste des conversations
   → GET /api/conversations

4. Utilisateur ouvre une conversation
   → GET /api/conversations/{id}
   → Les messages non lus sont automatiquement marqués comme lus
```

---

### 5.1 Démarrer ou récupérer une conversation

**`POST /api/conversations`**

> ✨ **Idempotent :** Si une conversation existe déjà entre cet acheteur et ce vendeur pour cette annonce, elle est retournée (pas de doublon).

**Corps de la requête :**
```json
{
  "listing_id": 42
}
```

**Réponse `201 Created` (nouvelle conversation) ou `200 OK` (existante) :**
```json
{
  "message": "Conversation créée.",
  "conversation": {
    "id": 7,
    "listing_id": 42,
    "buyer_id": 2,
    "seller_id": 1,
    "last_message_at": null,
    "listing": { "id": 42, "title": "Guitare acoustique", "status": "publiee" },
    "buyer": { "id": 2, "name": "Bob Dupont" },
    "seller": { "id": 1, "name": "Alice Martin" },
    "latest_message": null
  }
}
```

**Erreur `422` — Tenter de se contacter soi-même :**
```json
{
  "message": "Vous ne pouvez pas vous envoyer un message pour votre propre annonce."
}
```

---

### 5.2 Lister mes conversations

**`GET /api/conversations`**

**Paramètres de requête optionnels :**
- `per_page` — défaut 20

**Réponse `200 OK` (paginée) :**
```json
{
  "data": [
    {
      "id": 7,
      "listing": { "id": 42, "title": "Guitare acoustique", "status": "publiee" },
      "buyer": { "id": 2, "name": "Bob Dupont" },
      "seller": { "id": 1, "name": "Alice Martin" },
      "latest_message": {
        "id": 15,
        "body": "Oui, toujours disponible !",
        "sender_id": 1,
        "created_at": "2025-01-15T11:30:00.000000Z"
      },
      "unread_count": 2,
      "last_message_at": "2025-01-15T11:30:00.000000Z"
    }
  ],
  "...pagination..."
}
```

> 📌 **`unread_count` :** Nombre de messages non lus **reçus** dans cette conversation. Utiliser pour afficher un badge.

---

### 5.3 Ouvrir une conversation (avec tous les messages)

**`GET /api/conversations/{id}`**

> ✨ **Comportement automatique :** Tous les messages non lus de l'autre participant sont automatiquement marqués comme lus (`read_at` renseigné). Le `unread_count` diminuera au prochain appel à `/conversations`.

**Réponse `200 OK` :**
```json
{
  "conversation": {
    "id": 7,
    "listing": { "id": 42, "title": "Guitare acoustique", "status": "publiee", "price": "45.00", "type": "vente" },
    "buyer": { "id": 2, "name": "Bob Dupont" },
    "seller": { "id": 1, "name": "Alice Martin" },
    "messages": [
      {
        "id": 14,
        "conversation_id": 7,
        "sender_id": 2,
        "body": "Bonjour, est-ce toujours disponible ?",
        "read_at": "2025-01-15T11:25:00.000000Z",
        "created_at": "2025-01-15T11:20:00.000000Z",
        "sender": { "id": 2, "name": "Bob Dupont" }
      },
      {
        "id": 15,
        "conversation_id": 7,
        "sender_id": 1,
        "body": "Oui, toujours disponible !",
        "read_at": null,
        "created_at": "2025-01-15T11:30:00.000000Z",
        "sender": { "id": 1, "name": "Alice Martin" }
      }
    ]
  }
}
```

**Erreur `403 Forbidden` :** L'utilisateur n'est pas participant de cette conversation.

---

### 5.4 Envoyer un message

**`POST /api/conversations/{id}/messages`**

**Corps de la requête :**
```json
{
  "body": "Je peux passer samedi matin, ça vous convient ?"
}
```

| Champ | Type | Requis | Règles |
|---|---|---|---|
| `body` | string | ✅ | Non vide |

**Réponse `201 Created` :**
```json
{
  "message": "Message envoyé.",
  "data": {
    "id": 16,
    "conversation_id": 7,
    "sender_id": 2,
    "body": "Je peux passer samedi matin, ça vous convient ?",
    "read_at": null,
    "created_at": "2025-01-15T12:00:00.000000Z",
    "sender": { "id": 2, "name": "Bob Dupont" }
  }
}
```

---

### 5.5 Compteur de messages non lus (badge global)

**`GET /api/conversations/unread-count`**

> 📌 Utiliser cette route pour afficher le badge de notifications dans la navbar. Appeler régulièrement (polling toutes les 30s par exemple).

**Réponse `200 OK` :**
```json
{
  "unread_count": 5
}
```

---

## 6. Favoris

> 🔒 Token requis pour toutes ces routes.

### 6.1 Ajouter / Retirer un favori (toggle)

**`POST /api/listings/{id}/favorite`**

> ✨ **Toggle :** Si l'annonce est déjà en favori, elle est retirée. Sinon, elle est ajoutée. Un seul endpoint suffit.

**Réponse `201 Created` — Ajouté :**
```json
{
  "message": "Annonce ajoutée aux favoris.",
  "is_favorited": true
}
```

**Réponse `200 OK` — Retiré :**
```json
{
  "message": "Annonce retirée des favoris.",
  "is_favorited": false
}
```

> 📌 **Utiliser `is_favorited`** pour mettre à jour l'état du bouton cœur immédiatement côté front sans recharger la page.

---

### 6.2 Mes favoris

**`GET /api/favorites`**

**Paramètres de requête optionnels :**
- `per_page` — défaut 15

**Réponse `200 OK` :** Structure paginée identique à `GET /api/listings`. Seules les annonces **publiées** (`status = publiee`) sont retournées.

---

## 7. Signalements

> 🔒 Token requis.

### 7.1 Signaler une annonce

**`POST /api/listings/{id}/report`**

> ✅ Un utilisateur ne peut signaler une même annonce qu'**une seule fois**.

**Corps de la requête :**
```json
{
  "reason": "Cette annonce est frauduleuse, le vendeur demande un paiement externe."
}
```

| Champ | Type | Requis | Règles |
|---|---|---|---|
| `reason` | string | ✅ | max 1000 caractères |

**Réponse `201 Created` :**
```json
{
  "message": "Signalement enregistré. Un modérateur va examiner cette annonce.",
  "report": {
    "id": 3,
    "reporter_id": 2,
    "listing_id": 42,
    "reason": "Cette annonce est frauduleuse...",
    "status": "pending"
  }
}
```

**Erreur `422` — Déjà signalé :**
```json
{
  "message": "Vous avez déjà signalé cette annonce."
}
```

---

## 8. Profil Vendeur Public

**`GET /api/users/{id}`** — Pas de token requis

Permet d'afficher la page profil d'un vendeur avec ses statistiques.

**Réponse `200 OK` :**
```json
{
  "user": {
    "id": 1,
    "name": "Alice Martin",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "last_seen_at": "2025-01-15T11:00:00.000000Z",
    "is_active": true
  },
  "stats": {
    "published_listings_count": 12,
    "sold_listings_count": 8,
    "response_rate_percent": 85,
    "registration_date": "2025-01-01T00:00:00+00:00"
  }
}
```

> 📌 **Indicateur de présence :** `last_seen_at` est mis à jour automatiquement à chaque requête API de l'utilisateur. Utiliser pour afficher une pastille verte si `last_seen_at` < 5 minutes :
> ```javascript
> const isOnline = (new Date() - new Date(user.last_seen_at)) < 5 * 60 * 1000;
> ```

---

## 9. Modération (Rôle Admin)

> 🔒 Token requis + rôle `moderateur` obligatoire. Retourne `403 Forbidden` pour les membres normaux.

### 9.1 Annonces en attente de validation

**`GET /api/moderation/pending`**

**Réponse `200 OK` :** Liste paginée des annonces avec `status = "draft"`, triées de la plus ancienne à la plus récente.

---

### 9.2 Approuver une annonce

**`PUT /api/moderation/listings/{id}/approve`**

L'annonce passe du statut `draft` → `publiee` et devient visible publiquement.

**Réponse `200 OK` :**
```json
{
  "message": "Annonce approuvée et publiée.",
  "listing": { "...annonce avec status: publiee..." }
}
```

**Erreur `422` — Annonce non en brouillon :**
```json
{
  "message": "Seules les annonces en brouillon peuvent être approuvées."
}
```

---

### 9.3 Refuser une annonce

**`PUT /api/moderation/listings/{id}/reject`**

L'annonce passe du statut `draft` → `archivee`.

**Corps de la requête :**
```json
{
  "reason": "Cette annonce ne respecte pas les règles de la communauté."
}
```

**Réponse `200 OK` :**
```json
{
  "message": "Annonce refusée.",
  "listing": { "...annonce avec status: archivee..." },
  "reason": "Cette annonce ne respecte pas les règles de la communauté."
}
```

---

### 9.4 Lister les signalements ouverts

**`GET /api/moderation/reports`**

**Réponse `200 OK` :** Liste paginée des signalements avec `status = "pending"`.
```json
{
  "data": [
    {
      "id": 3,
      "reporter": { "id": 2, "name": "Bob Dupont", "email": "bob@uni.fr" },
      "listing": {
        "id": 42,
        "title": "Guitare acoustique",
        "status": "publiee",
        "user_id": 1,
        "user": { "id": 1, "name": "Alice Martin" }
      },
      "reason": "Contenu frauduleux",
      "status": "pending",
      "created_at": "2025-01-15T13:00:00.000000Z"
    }
  ]
}
```

---

### 9.5 Résoudre un signalement

**`PUT /api/moderation/reports/{id}`**

**Corps de la requête :**
```json
{
  "action": "hide",
  "note": "Contenu effectivement inapproprié. Annonce masquée."
}
```

| Champ | Type | Requis | Valeurs possibles |
|---|---|---|---|
| `action` | string | ✅ | `hide` (archive l'annonce), `warn` (avertissement, annonce conservée), `delete` (supprime définitivement l'annonce) |
| `note` | string | ❌ | Note interne du modérateur, max 1000 caractères |

**Réponse `200 OK` :**
```json
{
  "message": "Signalement traité.",
  "report": { "...signalement avec status: resolved..." }
}
```

---

### 9.6 Lister les membres

**`GET /api/moderation/users`**

**Paramètres de requête optionnels :**

| Paramètre | Description | Exemple |
|---|---|---|
| `q` | Recherche par nom ou email | `?q=alice` |
| `banned` | Filtrer : `true` ou `false` | `?banned=true` |
| `per_page` | Défaut 20 | |

---

### 9.7 Bannir un utilisateur

**`PUT /api/moderation/users/{id}/ban`**

> ✨ **Effet immédiat :** Tous les tokens de l'utilisateur sont révoqués au moment du bannissement. Il est déconnecté instantanément de tous ses appareils.

**Corps de la requête :**
```json
{
  "ban_until": "2025-03-01T00:00:00",
  "reason": "Comportement frauduleux répété."
}
```

| Champ | Type | Requis | Règles |
|---|---|---|---|
| `ban_until` | datetime | ✅ | Doit être une date dans le futur |
| `reason` | string | ❌ | max 500 caractères |

**Réponse `200 OK` :**
```json
{
  "message": "Utilisateur Bob Dupont banni jusqu'au 2025-03-01T00:00:00.",
  "user": { "...utilisateur avec is_active: false..." }
}
```

**Erreur `422` — Tentative de bannir un modérateur :**
```json
{
  "message": "Impossible de bannir un modérateur."
}
```

---

### 9.8 Lever un bannissement

**`PUT /api/moderation/users/{id}/unban`**

**Corps de la requête :** Aucun

**Réponse `200 OK` :**
```json
{
  "message": "Bannissement de Bob Dupont levé.",
  "user": { "...utilisateur avec is_active: true, ban_until: null..." }
}
```

---

## 10. Codes d'erreur globaux

| Code HTTP | Signification | Quand ça arrive |
|---|---|---|
| `200` | Succès | Requête GET ou action réussie |
| `201` | Créé | Ressource créée avec succès |
| `401` | Non authentifié | Token absent, invalide ou expiré → rediriger vers login |
| `403` | Accès refusé | Compte banni, ou action interdite pour ce rôle |
| `404` | Non trouvé | Ressource inexistante (mauvais ID, etc.) |
| `409` | Conflit | Doublon d'annonce détecté |
| `422` | Données invalides | Erreur de validation — voir `errors` dans la réponse |
| `500` | Erreur serveur | Problème interne, contacter le backend |

### Format des erreurs de validation (`422`)

```json
{
  "message": "The title field is required.",
  "errors": {
    "title": ["Le titre est obligatoire."],
    "price": ["Le prix est obligatoire pour une vente."]
  }
}
```

> 📌 Itérer sur `errors` pour afficher les messages sous chaque champ de formulaire.

---

## 11. Exemples de code prêts à l'emploi

### Flux complet d'inscription + connexion

```javascript
// 1. Inscription
const { token, user } = await apiCall('/auth/register', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Alice Martin',
    email: 'alice@universite.fr',
    password: 'MonMotDePasse123',
    password_confirmation: 'MonMotDePasse123',
  }),
});
localStorage.setItem('campus_token', token);
localStorage.setItem('campus_user', JSON.stringify(user));
```

### Afficher le catalogue avec filtres

```javascript
async function getListings(filters = {}) {
  const params = new URLSearchParams(filters);
  const data = await apiCall(`/listings?${params}`);
  // data.data = tableau des annonces
  // data.total = nombre total
  // data.next_page_url = URL de la prochaine page
  return data;
}

// Exemples d'utilisation
getListings({ q: 'guitare', sort: 'price_asc' });
getListings({ categories: 'livres,musique', price_max: 30 });
getListings({ type: 'don', per_page: 20 });
```

### Créer une annonce avec gestion du doublon

```javascript
async function createListing(listingData, forceCreate = false) {
  try {
    const payload = { ...listingData };
    if (forceCreate) payload.force_create = true;

    const data = await apiCall('/listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return { success: true, listing: data.listing };

  } catch (err) {
    if (err.status === 409) {
      // Doublon détecté — demander confirmation à l'utilisateur
      return {
        success: false,
        duplicate: err.data.duplicate_suggestion,
        message: err.data.message,
      };
    }
    throw err;
  }
}
```

### Chat — Afficher les messages et envoyer

```javascript
// Ouvrir/récupérer une conversation pour une annonce
async function openChat(listingId) {
  const { conversation } = await apiCall('/conversations', {
    method: 'POST',
    body: JSON.stringify({ listing_id: listingId }),
  });
  return conversation.id;
}

// Charger tous les messages (marque aussi comme lus)
async function loadMessages(conversationId) {
  const { conversation } = await apiCall(`/conversations/${conversationId}`);
  return conversation.messages; // tableau chronologique
}

// Envoyer un message
async function sendMessage(conversationId, text) {
  const { data: message } = await apiCall(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body: text }),
  });
  return message;
}
```

### Polling pour les notifications (badge non lus)

```javascript
// À appeler toutes les 30 secondes quand l'utilisateur est connecté
async function refreshUnreadBadge() {
  const { unread_count } = await apiCall('/conversations/unread-count');
  document.getElementById('unread-badge').textContent = unread_count || '';
}

setInterval(refreshUnreadBadge, 30_000);
```

### Construire l'URL d'une image

```javascript
// path = "listings/42/photo.jpg" (retourné par l'API)
function getImageUrl(path) {
  return `http://localhost:8000/storage/${path}`;
}

// Utilisation
const src = getImageUrl(listing.photos[0].path);
```

---

*Dernière mise à jour : Avril 2025 — Backend Laravel 11 + Sanctum*
