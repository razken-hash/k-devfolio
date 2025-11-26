# Getting Started with Angular 18
## File: assets/articles/getting-started-angular.md

# Getting Started with Angular 18

Angular 18 introduit de nombreuses améliorations et nouvelles fonctionnalités qui rendent le développement encore plus agréable. Dans cet article, nous allons explorer les principales nouveautés.

## Les Standalone Components

Les **standalone components** sont désormais la méthode recommandée pour créer des applications Angular. Voici un exemple simple:

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hello',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Hello {{ name }}!</h1>
  `
})
export class HelloComponent {
  name = 'Angular 18';
}
```

## Signals: La Nouvelle Réactivité

Angular 18 améliore l'API Signals pour une meilleure gestion de l'état:

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ double() }}</p>
      <button (click)="increment()">+</button>
    </div>
  `
})
export class CounterComponent {
  count = signal(0);
  double = computed(() => this.count() * 2);

  increment() {
    this.count.update(value => value + 1);
  }
}
```

## Améliorations du CLI

Le CLI Angular 18 offre de nouvelles commandes pour améliorer la productivité:

- `ng new` avec support des standalone components par défaut
- `ng generate` optimisé pour les nouveaux patterns
- Build plus rapide avec esbuild

> **Note importante**: Assurez-vous de mettre à jour votre CLI vers la dernière version pour profiter de toutes les nouvelles fonctionnalités.

## Routing Amélioré

Le nouveau système de routing offre une meilleure expérience:

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component')
      .then(m => m.AboutComponent)
  }
];
```

## Performance

Angular 18 apporte des améliorations significatives en termes de performance:

1. **Hydration** améliorée pour le SSR
2. **Change Detection** optimisée
3. **Bundle size** réduit
4. **Lazy loading** plus efficace

## Conclusion

Angular 18 représente une évolution majeure du framework, avec un focus sur la simplicité et la performance. Les standalone components et les Signals offrent une nouvelle façon moderne de développer des applications Angular.

N'hésitez pas à explorer la [documentation officielle](https://angular.io) pour plus de détails!