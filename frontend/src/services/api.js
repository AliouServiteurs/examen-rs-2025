import axios from 'axios';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';

// ========== REST API ==========
const API_URL = 'http://localhost:8080/api/personnes';

export const personneAPI = {
  create: (data) => axios.post(API_URL, data),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/${id}`),
};

// ========== GRAPHQL ==========
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const QUERIES = {
  ALL_PERSONNES: gql`
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
  `,
  
  SEARCH_PERSONNES: gql`
    query SearchPersonnes($nom: String, $prenom: String, $telephone: String) {
      searchPersonnes(nom: $nom, prenom: $prenom, telephone: $telephone) {
        id
        nom
        prenom
        dateNaissance
        adresse
        telephone
      }
    }
  `,
};