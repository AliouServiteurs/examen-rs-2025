# Frontend - React Material-UI

Interface utilisateur professionnelle avec Material Design pour la gestion des personnes.

## 📁 Structure du Projet
```
src/
├── components/
│   ├── Common/
│   │   └── Notification.jsx         # Snackbar notifications
│   ├── Layout/
│   │   └── Header.jsx               # AppBar principal
│   └── Personne/
│       ├── PersonneTable.jsx        # Tableau + recherche
│       ├── PersonneDialog.jsx       # Dialog Create/Edit
│       └── DeleteDialog.jsx         # Confirmation suppression
├── services/
│   └── api.js                       # REST + GraphQL clients
├── theme/
│   └── theme.js                     # Material-UI Theme
├── App.js                           # Composant principal
├── index.js                         # Point d'entrée
└── index.css                        # Styles globaux

public/
├── index.html
└── favicon.ico
```

## 🎨 Composants Principaux

### Header.jsx
Barre de navigation avec logo, titre et badge de version.

### PersonneTable.jsx
**Rôle :** Affichage et recherche des personnes (GraphQL)

**Fonctionnalités :**
- Tableau Material-UI avec tous les champs
- Recherche avancée (nom, prénom, téléphone)
- Boutons Modifier/Supprimer
- Loading state et compteur de résultats
- Affichage téléphone formaté : `+221 XX XXX XX XX`

**API :**
- GraphQL Query : `allPersonnes`
- GraphQL Query : `searchPersonnes`
- REST DELETE : `/api/personnes/{id}`

### PersonneDialog.jsx
**Rôle :** Dialog de création/modification (REST)

**Fonctionnalités :**
- Formulaire avec validation temps réel
- Preview téléphone formaté
- Messages d'erreur clairs
- Mode création/modification automatique

**Validations Frontend :**

**Nom/Prénom :**
```javascript
const validateNomPrenom = (value, field) => {
  const regex = /^[a-zA-ZÀ-ÿ\s]+$/;
  if (!value.trim()) return `Le ${field} est obligatoire`;
  if (!regex.test(value)) return `Le ${field} ne doit contenir que des lettres`;
  return null;
};
```
- ✅ Valide : `Diop`, `Ndèye`, `Marie Claire`
- ❌ Invalide : `Jean123`, `Marie@`

**Téléphone :**
```javascript
const validateTelephone = (value) => {
  const cleaned = value.replaceAll(' ', '');
  const regex = /^7[0-8]\d{7}$/;
  if (cleaned.length !== 9) return 'Le numéro doit contenir 9 chiffres';
  if (!regex.test(cleaned)) return 'Le numéro doit commencer par 7';
  return null;
};
```
- ✅ Valide : `771234567` → `+221 77 123 45 67`
- ❌ Invalide : `12345678`, `871234567`

**Adresse :**
```javascript
const validateAdresse = (value) => {
  const regex = /^[a-zA-Z0-9À-ÿ\s,.-]+$/;
  return regex.test(value) ? null : 'Caractères invalides';
};
```
- ✅ Valide : `Dakar, Plateau`, `Saint-Louis, Rue 15`
- ❌ Invalide : `Dakar@@@`

**Formatage téléphone progressif :**
- Tape `77` → `+221 77`
- Tape `77123` → `+221 77 123`
- Tape `771234567` → `+221 77 123 45 67`

### DeleteDialog.jsx
Dialog de confirmation avec icône warning et affichage du nom complet.

### Notification.jsx
Snackbar Material-UI pour remplacer les `alert()` :
- Success (vert)
- Error (rouge)
- Warning (orange)
- Info (bleu)

## 🔌 Services API

### api.js

**REST API :**
```javascript
const API_URL = 'http://localhost:8080/api/personnes';

export const personneAPI = {
  create: (data) => axios.post(API_URL, data),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/${id}`),
};
```

**GraphQL :**
```javascript
export const apolloClient = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
});

export const QUERIES = {
  ALL_PERSONNES: gql`
    query {
      allPersonnes {
        id nom prenom dateNaissance adresse telephone
      }
    }
  `,
  SEARCH_PERSONNES: gql`
    query SearchPersonnes($nom: String, $prenom: String, $telephone: String) {
      searchPersonnes(nom: $nom, prenom: $prenom, telephone: $telephone) {
        id nom prenom dateNaissance adresse telephone
      }
    }
  `,
};
```

**Utilisation :**

Création (REST) :
```javascript
await personneAPI.create(form);
```

Liste (GraphQL) :
```javascript
const { data } = await apolloClient.query({
  query: QUERIES.ALL_PERSONNES,
  fetchPolicy: 'network-only',
});
```

## 🎨 Theme Material-UI
```javascript
export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },      // Bleu professionnel
    secondary: { main: '#424242' },    // Gris foncé
    success: { main: '#2e7d32' },
    error: { main: '#d32f2f' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none' },
  },
});
```

## 🧪 Tests Manuels

### 1. Création
1. Cliquer sur bouton FAB (+)
2. Remplir : Nom `Diop`, Prénom `Moussa`, Téléphone `771234567`
3. Vérifier preview : `+221 77 123 45 67`
4. Enregistrer
5. **Résultat attendu :**
   - Notification verte : "Personne créée avec succès"
   - Tableau rafraîchi avec nouvelle ligne
   - Nom : `DIOP` (majuscules)
   - Prénom : `Moussa` (capitalisé)

### 2. Validation Frontend
**Test nom invalide :**
- Saisir `Jean123`
- **Erreur :** "Le nom ne doit contenir que des lettres"

**Test téléphone invalide :**
- Saisir `12345678` → "Doit contenir 9 chiffres"
- Saisir `871234567` → "Doit commencer par 7"

### 3. Recherche
1. Taper `Diop` dans champ Nom
2. Cliquer "Rechercher"
3. **Résultat :** Seules personnes avec "Diop" affichées
4. Cliquer "Réinitialiser" → Toutes les personnes reviennent

### 4. Modification
1. Cliquer icône ✏️ (Edit)
2. Champs pré-remplis
3. Modifier prénom en `Aïssatou`
4. Enregistrer
5. **Résultat :** Notification "Personne modifiée avec succès"

### 5. Suppression
1. Cliquer icône 🗑️ (Delete)
2. Confirmer dans dialog
3. **Résultat :** Personne disparue du tableau

### 6. Validation Backend (Unicité téléphone)
1. Créer Personne A : tel `771234567`
2. Créer Personne B : tel `771234567`
3. **Résultat :** Erreur "Ce numéro existe déjà"

## 🐛 Débogage

### Console navigateur (F12)

**Vérifier :**
- Pas d'erreurs rouges
- Requêtes réseau (Network) :
  - POST/PUT/DELETE → `http://localhost:8080/api/personnes`
  - GraphQL → `http://localhost:8080/graphql`

**Erreurs courantes :**

**CORS :**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution :** Vérifier `CorsConfig.java` backend avec `http://localhost:3000`

**Network Error :**
```
Error: Network Error
```
**Solution :** Vérifier que backend tourne sur port 8080

**GraphQL ne charge pas :**
**Solution :** Vérifier `spring.graphql.graphiql.enabled=true` dans `application.properties`

## 📦 Installation et Démarrage

### Installation
```bash
cd frontend
npm install
```

### Démarrage (développement)
```bash
npm start
```
Application sur **http://localhost:3000**

### Build (production)
```bash
npm run build
```
Fichiers optimisés dans `build/`

## 🔧 Configuration

**Modifier URLs API :**

Fichier : `src/services/api.js`
```javascript
const API_URL = 'http://localhost:8080/api/personnes';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
});
```

## 📊 Dépendances
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.14.0",
    "@mui/icons-material": "^5.14.0",
    "@apollo/client": "^3.7.17",
    "graphql": "^16.6.0",
    "axios": "^1.6.0"
  }
}
```

**Installation manuelle :**
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install axios
npm install @apollo/client graphql
```

## 🎯 Points Clés

**Architecture :**
- Composants fonctionnels avec Hooks
- Séparation des responsabilités
- Services API centralisés
- Theme MUI global

**UX/UI :**
- Design Material moderne
- Feedback utilisateur (notifications)
- Loading states
- Validation temps réel
- Messages d'erreur clairs

**Performance :**
- GraphQL pour lectures (pas de sur-fetching)
- REST pour mutations (standard)
- Cache Apollo Client
- Fetch policy : `network-only`

**Accessibilité :**
- Labels sur tous les champs
- Tooltips sur boutons
- Messages descriptifs
- Navigation clavier

## 📝 Checklist Pré-Démonstration

- [ ] Backend tourne (port 8080)
- [ ] Frontend tourne (port 3000)
- [ ] Pas d'erreurs console (F12)
- [ ] CORS fonctionne
- [ ] GraphiQL accessible
- [ ] 3+ personnes créées
- [ ] Validations testées
- [ ] Recherche testée
- [ ] Modification testée
- [ ] Suppression testée

## 🚀 Commandes Rapides
```bash
# Installation
npm install

# Démarrage
npm start

# Build production
npm run build

# Tests
npm test

# Linter
npm run lint
```

## 📚 Documentation

- [React Documentation](https://react.dev)
- [Material-UI](https://mui.com)
- [Apollo Client](https://www.apollographql.com/docs/react)

---

**Retour au [README principal](../README.md) | Voir le [Backend README](../backend/README.md)**