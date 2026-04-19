# Guide d'Architecture et d'Intégration de l'API CampusShop 🚀

Ce document a pour but d'expliquer l'architecture du backend Laravel aux collaborateurs (Développeurs Frontend, Mobile, ou Evaluateurs) et de fournir les bases nécessaires pour connecter n'importe quelle Interface à ce système.

## 1. À quoi sert ce Backend ?
Le backend CampusShop agit comme le "Cerveau Central" (Single Source of Truth) du projet. 
Il expose une **API RESTful 100% JSON**, qui est totalement **agnostique**. Cela signifie qu'il a été conçu dès le premier jour pour pouvoir être consommé par n'importe quelle application cliente :
* Une interface Web moderne (React, Vue, Next.js).
* Une application Mobile native (Flutter, React Native, iOS, Android).

Il sécurise les données, s'occupe de la logique métier (modération, validation, etc.), et renvoie la donnée la plus pure possible au Front pour qu'il n'ait plus qu'à "l'afficher".

---

## 2. Le Mécanisme d'Authentification (Sanctum)
Sur un site web traditionnel, on utilise des cookies de session. Pour ce projet, afin d'être totalement compatible Mobile et SPA, nous utilisons de l'authentification par **Jeton d'Accès (Bearer Token)** gérée par Laravel Sanctum.

**Le Cycle de vie de l'intégration :**
1. **Connexion** : L'app Front envoie un appel HTTP `POST` sur `/api/auth/login` avec l'email et le mot de passe.
2. **Distribution** : L'API valide et retourne un jeton sécurisé (ex: `1|aBcDeF12...`).
3. **Mémorisation** : L'app Front enregistre ce jeton localement (`SecureStorage` sur mobile, ou contexte mémoire sur le web).
4. **Utilisation** : Lorsque l'app Front veut faire une action sensible (ex: Envoyer un message privé), elle ajoute cette ligne aux `Headers` de sa requête :  
   `Authorization: Bearer 1|aBcDeF12...`

---

## 3. Les Grandes Familles de Requêtes (Endpoints)
Voici les bases de l'API pour faciliter votre intégration de l'UI :

* **Auth & Profil (`/api/auth/*`)** : Permet l'enregistrement (`register`), le `login`, le `logout` et la récupération/modification du profil de l'utilisateur connecté (`me`). De plus, `GET /api/users/{id}` permet de récupérer publiquement les **statistiques d'un vendeur**.
* **Catalogue & Annonces (`/api/listings/*`)** :
    * `GET /api/listings` : Récupère la grille publique. Gère automatiquement la **recherche** (`?q=mot_de_passe`), les **catégories** (`?categories=slug`) et le tri (`?sort=price_asc`).
    * `POST /api/listings` : Intègre la fonction poussée de blocage des doublons (retourne `409 Conflict` si le titre est trop similaire à une de vos annonces précédentes).
* **Messagerie Temps-Réel (`/api/conversations/*`)** : Permet de créer un chat avec un vendeur, d'y envoyer des messages et de récupérer les bulles. Une route spéciale renvoie le compteur de notifications non lues.
* **Système de Modération (`/api/moderation/*`)** : Uniquement pour les comptes "Mods" (Admins). Routes permettant de bloquer l'accès à un joueur frauduleux, ou de rejeter une annonce.

---

## 4. Mécaniques "Bonus" & Techniques de Pointe (Pour la Soutenance)
Le backend n'est pas qu'un simple livreur de données ; il embarque des mécaniques avancées invisibles au frontend :

> [!TIP]
> - **Historique des Prix** : Un design pattern "*Observer*" écoute dans l'ombre les requêtes de modification d'annonce. Si le prix baisse ou monte, la BDD conserve mathématiquement la trace de la fluctuation de prix pour lutter contre les faux rabais.
> - **Indicateur de Présence (Last Seen)** : Un *Middleware* intercepte toute activité API d'un jeton et met à jour dynamiquement le statut "Vu il y a X minutes", permettant au frontend d'afficher une pastille verte de connexion.
> - **Incrémentation des vues propre** : L'API utilise une requête directe DB builder (`increment`) pour marquer le passage des utilisateurs sur une annonce sans pour autant invalider les caches et déclencher les *Updated_at* inutilement.

---

## 5. Exemple Concret d'Intégration Frontend (JS/React/React Native)

Voici un exemple "Drop-in" de comment le Frontend doit réagir pour lister les annonces privées.

```javascript
/**
 * Fonction générique pour attaquer le backend de l'extérieur.
 */
async function fetchMyListings(userToken) {
    try {
        const response = await fetch('http://localhost:8000/api/my-listings', {
            method: 'GET',
            headers: {
                'Accept': 'application/json', // Très important pour forcer une erreur JSON en retour
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}` // Injection du Jeton
            }
        });

        const data = await response.json();

        if (!response.ok) {
            // Ex: 401 (Expire), 403 (Bannis)
            throw new Error(data.message || 'Erreur lors de la récupération');
        }

        // data contiendra les pages (data.data) avec la pagination Laravel en cadeau !
        return data.data; 

    } catch (error) {
        console.error("Erreur serveur :", error);
    }
}
```
*Le backend s'occupe de la protection, le frontend n'a qu'à dessiner le tableau avec les variables !*
