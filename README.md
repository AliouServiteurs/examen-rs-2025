# 📱 Système de Gestion des Personnes

Application fullstack de gestion de personnes avec architecture REST et GraphQL.

## 🎯 Description

Projet d'examen - Application CRUD complète avec :
- **Backend** : Spring Boot 3 (Java 17) - REST API + GraphQL
- **Frontend** : React 18 + Material-UI
- **Base de données** : MariaDB

## 🏗️ Architecture
```
┌─────────────────────────────────────┐
│    Frontend (React + MUI)           │
│    Port: 3000                       │
└──────────────┬──────────────────────┘
               │ HTTP/GraphQL
┌──────────────▼──────────────────────┐
│    Backend (Spring Boot)            │
│    Port: 8080                       │
│    - REST API (POST/PUT/DELETE)     │
│    - GraphQL (Queries)              │
└──────────────┬──────────────────────┘
               │ JDBC
┌──────────────▼──────────────────────┐
│    MariaDB                          │
│    Port: 3306                       │
└─────────────────────────────────────┘
```

## 📋 Fonctionnalités

- ✅ Création de personnes (REST POST)
- ✅ Modification (REST PUT)
- ✅ Suppression (REST DELETE)
- ✅ Liste complète (GraphQL Query)
- ✅ Recherche avec filtres (GraphQL Query)
- ✅ Validation stricte (format sénégalais)
- ✅ Interface Material Design professionnelle

## 🛠️ Technologies

### Backend
- Spring Boot 3.x
- Java 17
- Spring Data JPA
- Spring for GraphQL
- MariaDB
- Lombok
- Jakarta Validation

### Frontend
- React 18
- Material-UI (MUI) v5
- Apollo Client (GraphQL)
- Axios (REST)

## ⚙️ Installation

### Prérequis
- Java JDK 17+
- Maven 3.8+
- Node.js 16+
- MariaDB 10+

### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/examen-rs-2025.git
cd examen-rs-2025
```

### 2. Configuration de la base de données
```sql
CREATE DATABASE IF NOT EXISTS examen_rs_db;
```

### 3. Backend
```bash
cd backend

# Configurer application.properties
# Modifier le mot de passe MariaDB si nécessaire

# Compiler et démarrer
mvn clean install
mvn spring-boot:run
```

Backend accessible sur : http://localhost:8080

### 4. Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer
npm start
```

Frontend accessible sur : http://localhost:3000

## 📚 Documentation

- [Backend README](backend/README.md) - Documentation backend détaillée
- [Frontend README](frontend/README.md) - Documentation frontend détaillée

## 🧪 Tests

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test
```

## 📊 API Documentation

### REST Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/personnes` | Créer une personne |
| PUT | `/api/personnes/{id}` | Modifier une personne |
| DELETE | `/api/personnes/{id}` | Supprimer une personne |

### GraphQL Queries

**GraphiQL :** http://localhost:8080/graphiql
```graphql
# Lister toutes les personnes
query {
  allPersonnes {
    id
    nom
    prenom
    dateNaissance
    adresse
    telephone
  }
}

# Rechercher
query {
  searchPersonnes(nom: "Diop") {
    id
    nom
    prenom
  }
}
```

## 🎨 Captures d'écran

![Interface principale](docs/screenshots/main.png)

## 🔧 Validation des données

### Format téléphone sénégalais
- 9 chiffres commençant par 7
- Affichage : `+221 XX XXX XX XX`
- Exemples valides : 771234567, 781234567

### Nom/Prénom
- Lettres uniquement (accents autorisés)
- Pas de chiffres ni symboles

### Adresse
- Lettres, chiffres, espaces, tirets, virgules, points

## 👨‍💻 Auteur

**[Votre Nom]**
- GitHub: [@votre-username](https://github.com/votre-username)
- Email: votre.email@example.com

## 📄 License

Projet académique - Examen 2025

## 🙏 Remerciements

- Spring Boot Documentation
- React Documentation
- Material-UI
