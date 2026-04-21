# Guide d'utilisation des scripts de base de données
# Campus Shop - Database Scripts Guide

## 📋 Vue d'ensemble

Ce répertoire contient 4 scripts pour initialiser et gérer la base de données SQLite du projet Campus Shop.

---

## 🚀 Scripts disponibles

### 1. **seed-db.bat** (Windows)
**Usage simple pour initialiser la base de données**

```bash
seed-db.bat
```

**Qu'il fait:**
- ✓ Crée le fichier `database/database.sqlite`
- ✓ Exécute les migrations
- ✓ Remplit la base de données avec des données de test

**Idéal pour:** Première installation ou réinitialisation simple

---

### 2. **seed-db.ps1** (PowerShell - Windows)
**Version PowerShell du script d'initialisation**

```powershell
.\seed-db.ps1
```

**Qu'il fait:**
- ✓ Même chose que `seed-db.bat`
- ✓ Meilleur affichage des messages colorés

**Idéal pour:** Utilisateurs PowerShell qui préfèrent les couleurs

---

### 3. **reset-db.bat** (Windows)
**Réinitialisation complète avec demande de confirmation**

```bash
reset-db.bat
```

**Qu'il fait:**
- ⚠️ SUPPRIME tout le contenu de la base de données
- ✓ Exécute `migrate:fresh` (recrée toutes les tables)
- ✓ Remplit avec de nouvelles données de test
- ✓ Nettoie le cache Laravel

**Idéal pour:** Recommencer à zéro pendant le développement

---

### 4. **seed-db-fresh.ps1** (PowerShell)
**Réinitialisation complète avec PowerShell**

```powershell
.\seed-db-fresh.ps1
```

**Qu'il fait:**
- ⚠️ SUPPRIME tout le contenu de la base de données
- ✓ Même chose que `reset-db.bat`

**Idéal pour:** Utilisateurs PowerShell qui veulent une réinitialisation complète

---

## 👤 Comptes de test créés

Après l'exécution de n'importe quel script, les comptes suivants sont disponibles:

| Email | Rôle | Mot de passe |
|-------|------|-------------|
| `moderateur@campus.edu` | Modérateur | `password` |
| `jean@campus.edu` | Membre | `password` |
| Autres emails générés aléatoirement | Membre | `password` |

---

## 📊 Données de test créées

Le seeder (`DatabaseSeeder.php`) crée:
- ✓ 1 modérateur
- ✓ 10 membres réguliers + 1 utilisateur de test
- ✓ ~20-25 annonces publiées et en draft
- ✓ Conversations avec messages
- ✓ Favoris entre utilisateurs
- ✓ Rapports d'annonces signalées

---

## ⚙️ Configuration requise

Avant d'exécuter les scripts, assurez-vous que:

1. **PHP est installé** et accessible dans PATH
   ```bash
   php -v
   ```

2. **Le fichier `.env` existe** dans le répertoire backend
   ```bash
   copy .env.example .env
   ```

3. **Vous êtes dans le répertoire `backend`**
   ```bash
   cd backend
   ```

4. **Dépendances Composer installées**
   ```bash
   composer install
   ```

---

## 🛠️ Utilisation avancée

### Exécuter uniquement les migrations
```bash
php artisan migrate
```

### Exécuter uniquement le seeder
```bash
php artisan db:seed
```

### Réinitialiser les migrations uniquement
```bash
php artisan migrate:fresh
```

### Nettoyer le cache après modification du seeder
```bash
php artisan cache:clear
php artisan view:clear
```

### Afficher les tables créées
```bash
php artisan tinker
>>> DB::connection()->getDoctrineSchemaManager()->listTables()
```

---

## 📝 Personnalisation

Pour modifier les données de test:

1. **Éditer les Factories** (`database/factories/`)
   - `UserFactory.php` - Générer des utilisateurs
   - `ListingFactory.php` - Générer des annonces

2. **Éditer le Seeder** (`database/seeders/DatabaseSeeder.php`)
   - Ajouter/retirer des utilisateurs
   - Modifier le nombre d'annonces
   - Changer les données de test

Exemple dans `DatabaseSeeder.php`:
```php
// Créer 20 utilisateurs au lieu de 10
$members = User::factory(20)->create();

// Créer 50 annonces au lieu de 15
foreach ($allMembers->random(15) as $member) {
    // ...
}
```

---

## 🐛 Dépannage

### Erreur: "artisan file not found"
→ Vérifiez que vous êtes dans le répertoire `backend`

### Erreur: ".env file not found"
→ Copiez `.env.example` en `.env`: `copy .env.example .env`

### Erreur: "PHP is not installed"
→ Installez PHP ou ajoutez-le à votre PATH

### Erreur: "Migration failed"
→ Vérifiez les logs: `tail -f storage/logs/laravel.log`

### La base de données reste bloquée
```bash
# Windows
taskkill /F /IM php.exe

# PowerShell
Stop-Process -Name php -Force
```

---

## 📚 Ressources

- [Laravel Documentation - Seeding](https://laravel.com/docs/seeding)
- [Laravel Documentation - Factories](https://laravel.com/docs/eloquent-factories)
- [SQLite Documentation](https://www.sqlite.org/)

---

## 💡 Bonnes pratiques

- ✓ Utilisez `seed-db.bat` pour la première installation
- ✓ Utilisez `reset-db.bat` lors du développement pour repartir de zéro
- ✓ Versionnez vos migrations (elles sont dans `database/migrations/`)
- ✓ Ne versionnez pas `database.sqlite` (ajoutez-le à `.gitignore`)
- ✓ Testez les modifications du seeder avant de les commiter

---

**Créé pour Campus Shop - Système de gestion d'annonces entre étudiants**
