# Backend - Spring Boot REST & GraphQL

## Structure
```
src/main/java/com/leserviteurs/backend_rest_grapql/
├── controller/          # REST Controllers
├── graphql/            # GraphQL Resolvers
├── service/            # Business Logic
├── repository/         # Data Access
├── model/              # JPA Entities
├── dto/                # Data Transfer Objects
├── mapper/             # Entity ↔ DTO
├── validation/         # Custom Validators
└── exception/          # Exception Handling
```

## Configuration

Modifier `src/main/resources/application.properties` :
```properties
spring.datasource.url=jdbc:mariadb://localhost:3306/examen_rs_db
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE
```

## Démarrage
```bash
mvn spring-boot:run
```

## Endpoints

- REST API : http://localhost:8080/api/personnes
- GraphiQL : http://localhost:8080/graphiql
