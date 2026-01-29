# Backend - Spring Boot REST & GraphQL API

API complète avec architecture REST pour les mutations et GraphQL pour les lectures.

## 📁 Structure du Projet
```
src/main/java/com/leserviteurs/backend_rest_grapql/
├── controller/
│   └── PersonneRestController.java      # REST API (POST, PUT, DELETE)
├── graphql/
│   ├── PersonneGraphQLController.java   # GraphQL Queries
│   └── GraphQLExceptionHandler.java     # Gestion erreurs GraphQL
├── service/
│   ├── PersonneService.java             # Interface
│   └── PersonneServiceImpl.java         # Implémentation + validations
├── repository/
│   └── PersonneRepository.java          # Spring Data JPA
├── model/
│   └── Personne.java                    # Entité JPA
├── dto/
│   └── PersonneDTO.java                 # Data Transfer Object
├── mapper/
│   └── PersonneMapper.java              # Entity ↔ DTO
├── validation/
│   └── ValidationUtils.java             # Validations personnalisées
├── exception/
│   ├── ResourceNotFoundException.java   # Exception 404
│   ├── GlobalExceptionHandler.java      # Handler REST
│   └── ErrorResponse.java               # Format erreurs
├── config/
│   └── CorsConfig.java                  # Configuration CORS
└── BackendApplication.java              # Point d'entrée

src/main/resources/
├── application.properties               # Configuration
└── graphql/
    └── schema.graphqls                  # Schéma GraphQL
```

## 🗄️ Modèle de Données

### Table `personne`

| Colonne | Type | Contraintes |
|---------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| nom | VARCHAR(100) | NOT NULL |
| prenom | VARCHAR(100) | NOT NULL |
| date_naissance | DATE | - |
| adresse | VARCHAR(255) | - |
| telephone | VARCHAR(20) | - |

### Exemple d'enregistrement
```sql
INSERT INTO personne (nom, prenom, date_naissance, adresse, telephone) 
VALUES ('DIOP', 'Moussa', '1995-03-15', 'Dakar, Plateau', '77 123 45 67');
```

## 📡 API REST

### Endpoints

| Méthode | Endpoint | Description | Statut Success |
|---------|----------|-------------|----------------|
| POST | `/api/personnes` | Créer une personne | 201 Created |
| PUT | `/api/personnes/{id}` | Modifier une personne | 200 OK |
| DELETE | `/api/personnes/{id}` | Supprimer une personne | 204 No Content |
| DELETE | `/api/personnes/reset` | Réinitialiser table (dev) | 200 OK |

### Exemples de Requêtes REST

#### 1. Créer une personne

**Requête :**
```http
POST http://localhost:8080/api/personnes
Content-Type: application/json

{
  "nom": "Diop",
  "prenom": "Moussa",
  "dateNaissance": "1995-03-15",
  "adresse": "Dakar, Plateau",
  "telephone": "771234567"
}
```

**Réponse : 201 Created**
```json
{
  "id": 1,
  "nom": "DIOP",
  "prenom": "Moussa",
  "dateNaissance": "1995-03-15",
  "adresse": "Dakar, Plateau",
  "telephone": "77 123 45 67"
}
```

#### 2. Modifier une personne

**Requête :**
```http
PUT http://localhost:8080/api/personnes/1
Content-Type: application/json

{
  "nom": "Fall",
  "prenom": "Fatou",
  "dateNaissance": "1998-06-20",
  "adresse": "Thiès, Sénégal",
  "telephone": "781234567"
}
```

**Réponse : 200 OK**
```json
{
  "id": 1,
  "nom": "FALL",
  "prenom": "Fatou",
  "dateNaissance": "1998-06-20",
  "adresse": "Thiès, Sénégal",
  "telephone": "78 123 45 67"
}
```

#### 3. Supprimer une personne

**Requête :**
```http
DELETE http://localhost:8080/api/personnes/1
```

**Réponse : 204 No Content**

---

## 🔍 API GraphQL

### Schema
```graphql
type Personne {
    id: ID!
    nom: String!
    prenom: String!
    dateNaissance: String
    adresse: String
    telephone: String
}

type Query {
    allPersonnes: [Personne!]!
    personneById(id: ID!): Personne
    searchPersonnes(nom: String, prenom: String, telephone: String): [Personne!]!
}
```

### Exemples de Queries

#### 1. Lister toutes les personnes
```graphql
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
```

**Réponse :**
```json
{
  "data": {
    "allPersonnes": [
      {
        "id": "1",
        "nom": "DIOP",
        "prenom": "Moussa",
        "dateNaissance": "1995-03-15",
        "adresse": "Dakar, Plateau",
        "telephone": "77 123 45 67"
      }
    ]
  }
}
```

#### 2. Récupérer une personne par ID
```graphql
query {
  personneById(id: 1) {
    nom
    prenom
    telephone
  }
}
```

#### 3. Rechercher avec filtres
```graphql
query {
  searchPersonnes(nom: "Diop") {
    id
    nom
    prenom
    telephone
  }
}
```

---

## ✅ Validations

### Format Téléphone Sénégalais

**Règles :**
- Exactement 9 chiffres
- Commence par 7 (77, 78, 76, 75, 70)
- Unique en base de données

**Exemples valides :**
- `771234567` → Stocké : `77 123 45 67`
- `781234567` → Stocké : `78 123 45 67`

**Exemples invalides :**
- `12345678` → Erreur : "Doit contenir 9 chiffres"
- `871234567` → Erreur : "Doit commencer par 7"

### Nom/Prénom

**Règles :**
- Lettres uniquement (A-Z, a-z)
- Accents autorisés (é, è, à, ï, etc.)
- Espaces autorisés (noms composés)
- Pas de chiffres ni symboles

**Exemples valides :**
- `Diop`, `Ndèye`, `Aïssatou`, `Marie Claire`

**Exemples invalides :**
- `Jean123` → Erreur
- `Marie@` → Erreur

### Adresse

**Règles :**
- Lettres, chiffres, espaces
- Tirets `-` (Saint-Louis)
- Virgules `,` Points `.`

**Exemples valides :**
- `Dakar, Plateau`
- `Saint-Louis, Rue 15`
- `Villa n°25`

### Date de Naissance

**Règles :**
- Date dans le passé
- Âge minimum : 1 an
- Âge maximum : 120 ans

---

## ❌ Gestion d'Erreurs

### Codes de Statut HTTP

| Code | Signification | Exemple |
|------|---------------|---------|
| 200 | OK | Modification réussie |
| 201 | Created | Création réussie |
| 204 | No Content | Suppression réussie |
| 400 | Bad Request | Validation échouée |
| 404 | Not Found | Ressource inexistante |
| 500 | Internal Server Error | Erreur serveur |

### Exemples d'Erreurs

#### Validation échouée (400)

**Requête :**
```json
{
  "nom": "",
  "prenom": "Test"
}
```

**Réponse :**
```json
{
  "timestamp": "2025-01-29T14:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Le nom ne peut pas être vide"
}
```

#### Ressource non trouvée (404)

**Requête :**
```http
DELETE /api/personnes/999
```

**Réponse :**
```json
{
  "timestamp": "2025-01-29T14:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Personne non trouvée avec l'ID : 999"
}
```

#### Téléphone existe déjà (400)

**Réponse :**
```json
{
  "timestamp": "2025-01-29T14:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Ce numéro de téléphone existe déjà"
}
```

---

## 🧪 Tests

### Avec cURL
```bash
# Créer
curl -X POST http://localhost:8080/api/personnes \
  -H "Content-Type: application/json" \
  -d '{"nom":"Diop","prenom":"Moussa","telephone":"771234567"}'

# Modifier
curl -X PUT http://localhost:8080/api/personnes/1 \
  -H "Content-Type: application/json" \
  -d '{"nom":"Fall","prenom":"Fatou","telephone":"781234567"}'

# Supprimer
curl -X DELETE http://localhost:8080/api/personnes/1
```

### Avec Postman

1. Importer la collection (créer fichier `postman-collection.json`)
2. Exécuter les requêtes

### GraphiQL

Accéder à http://localhost:8080/graphiql et tester les queries

---

## ⚙️ Configuration

### application.properties
```properties
# Database
spring.datasource.url=jdbc:mariadb://localhost:3306/examen_rs_db
spring.datasource.username=root
spring.datasource.password=

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MariaDBDialect

# GraphQL
spring.graphql.graphiql.enabled=true
spring.graphql.graphiql.path=/graphiql
spring.graphql.path=/graphql

# Server
server.port=8080

# Logs
logging.level.org.springframework.graphql=DEBUG
```

---

## 🔧 Commandes Maven
```bash
# Compiler
mvn clean compile

# Tester
mvn test

# Packager
mvn clean package

# Démarrer
mvn spring-boot:run

# Skip tests
mvn clean install -DskipTests
```

---

## 📊 Scénario de Démonstration
```bash
# 1. Démarrer le backend
mvn spring-boot:run

# 2. Créer 3 personnes
curl -X POST http://localhost:8080/api/personnes -H "Content-Type: application/json" -d '{"nom":"Diop","prenom":"Moussa","telephone":"771234567"}'
curl -X POST http://localhost:8080/api/personnes -H "Content-Type: application/json" -d '{"nom":"Fall","prenom":"Fatou","telephone":"781234567"}'
curl -X POST http://localhost:8080/api/personnes -H "Content-Type: application/json" -d '{"nom":"Ndiaye","prenom":"Amadou","telephone":"775551234"}'

# 3. Lister via GraphQL
# Ouvrir http://localhost:8080/graphiql
# Exécuter: query { allPersonnes { id nom prenom } }

# 4. Modifier une personne
curl -X PUT http://localhost:8080/api/personnes/1 -H "Content-Type: application/json" -d '{"nom":"Diop","prenom":"Moussa Modifié","telephone":"771234567"}'

# 5. Supprimer
curl -X DELETE http://localhost:8080/api/personnes/3

# 6. Vérifier en base
mysql -u root -p examen_rs_db -e "SELECT * FROM personne;"
```

---

**Le backend est prêt ! Consultez le [Frontend README](../frontend/README.md) pour l'interface.**