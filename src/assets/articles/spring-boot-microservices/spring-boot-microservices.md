# Architecture Microservices avec Spring Boot

Les microservices sont devenus une architecture incontournable pour les applications modernes. Dans cet article, nous allons voir comment construire une architecture microservices avec Spring Boot.

## Pourquoi les Microservices?

Les microservices offrent plusieurs avantages:

- **Scalabilité**: Chaque service peut être mis à l'échelle indépendamment
- **Flexibilité**: Utilisation de différentes technologies par service
- **Résilience**: La défaillance d'un service n'affecte pas les autres
- **Déploiement**: Déploiement indépendant de chaque service

## Architecture de Base

Voici les composants principaux d'une architecture microservices:

| Composant | Rôle | Technologie |
|-----------|------|-------------|
| API Gateway | Point d'entrée unique | Spring Cloud Gateway |
| Service Registry | Découverte de services | Eureka |
| Config Server | Configuration centralisée | Spring Cloud Config |
| Services | Logique métier | Spring Boot |

## Création d'un Microservice

Créons un service simple avec Spring Boot:

```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody @Valid User user) {
        User created = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
```

## Communication entre Services

Pour la communication, nous pouvons utiliser:

```java
@FeignClient(name = "user-service")
public interface UserClient {
    
    @GetMapping("/api/users/{id}")
    User getUserById(@PathVariable Long id);
}
```

## Dockerisation

Dockerfile pour notre microservice:

```dockerfile
FROM openjdk:17-jdk-alpine
VOLUME /tmp
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## Docker Compose

```yaml
version: '3.8'
services:
  eureka-server:
    image: eureka-server:latest
    ports:
      - "8761:8761"
  
  user-service:
    image: user-service:latest
    depends_on:
      - eureka-server
    environment:
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka-server:8761/eureka
```

## Bonnes Pratiques

1. **Utiliser un API Gateway**
2. **Implémenter le Circuit Breaker**
3. **Centraliser la configuration**
4. **Monitorer les services**
5. **Sécuriser avec OAuth2**