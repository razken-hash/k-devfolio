import { Component } from '@angular/core';
import { Article } from '../../models/article.model';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendar,
  faClock,
  faTag,
  faSearch,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, RouterModule, FontAwesomeModule, Header],
  templateUrl: './blog.html',
  styles: ``,
})
export class Blog {
  private articles: Article[] = [
    {
      id: 'getting-started-angular',
      title: 'Getting Started with Angular 19',
      description: 'Un guide complet pour débuter avec Angular 18, couvrant les nouveautés et les meilleures pratiques.',
      date: '2025-01-15',
      file: 'getting-started-angular.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Angular', 'TypeScript', 'Frontend'],
      coverImage: 'assets/images/no_image_available.png',
      readingTime: 8,
    },
    {
      id: 'spring-boot-microservices',
      title: 'Microservices avec Spring Boot',
      description: 'Architecture microservices moderne avec Spring Boot, Docker et Kubernetes.',
      date: '2025-01-10',
      file: 'spring-boot-microservices.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Spring Boot', 'Microservices', 'Backend'],
      coverImage: 'assets/images/no_image_available.png',
      readingTime: 10,
    },
    {
      id: 'flutter-state-management',
      title: 'State Management dans Flutter',
      description: 'Comparaison des solutions de gestion d\'état dans Flutter : BLoC, Provider, Riverpod.',
      date: '2025-01-05',
      file: 'flutter-state-management.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Flutter', 'Dart', 'Mobile'],
      coverImage: 'assets/images/no_image_available.png',
      readingTime: 7,
    },
    {
      id: 'mastering-git-advanced',
      title: 'Git: Techniques Avancées pour Développeurs',
      description: 'Découvrez les commandes Git avancées, le rebase interactif, le cherry-pick et la gestion professionnelle des branches.',
      date: '2025-01-20',
      file: 'mastering-git-advanced.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Git', 'Version Control', 'DevOps'],
      coverImage: 'assets/images/no_image_available.png',
      readingTime: 9,
    },
    {
      id: 'nodejs-performance-optimization',
      title: 'Optimisation des Performances dans Node.js',
      description: 'Astuces et outils pour analyser, profiler et optimiser les performances des applications Node.js.',
      date: '2025-01-18',
      file: 'nodejs-performance-optimization.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Node.js', 'Backend', 'JavaScript'],
      coverImage: 'assets/images/no_image_available.png',
      readingTime: 11,
    },
    {
      id: 'mongodb-schema-design',
      title: 'Conception de Schémas Efficaces dans MongoDB',
      description: 'Les meilleures pratiques pour structurer vos collections, gérer les relations et assurer les performances.',
      date: '2025-01-12',
      file: 'mongodb-schema-design.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['MongoDB', 'Database', 'NoSQL'],
      coverImage: 'assets/images/no_image_available.png',
      readingTime: 8,
    },
    {
      id: 'react-hooks-deep-dive',
      title: 'React Hooks: Guide Complet et Cas Pratiques',
      description: 'Comprendre les hooks React en profondeur et apprendre à les utiliser dans des scénarios réels.',
      date: '2025-01-08',
      file: 'react-hooks-deep-dive.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['React', 'JavaScript', 'Frontend'],
      coverImage: 'assets/images/no_image_available.png',
      readingTime: 9,
    },
    {
      id: 'clean-architecture-overview',
      title: 'Clean Architecture: Principes et Mise en Œuvre',
      description: 'Introduction aux principes de Clean Architecture et leur application dans les projets modernes.',
      date: '2025-01-03',
      file: 'clean-architecture-overview.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Architecture', 'Design Patterns', 'Software Engineering'],
      coverImage: 'assets/images/no_image_available.png',
      readingTime: 12,
    },
    {
      id: 'kotlin-coroutines-basics',
      title: 'Kotlin Coroutines: Les Bases',
      description: 'Découvrez comment simplifier la gestion de la concurrence dans Android grâce aux coroutines.',
      date: '2025-01-02',
      file: 'kotlin-coroutines-basics.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Kotlin', 'Android', 'Mobile'],
      coverImage: 'assets/images/no_image_available.png',
      readingTime: 6,
    },
    {
      id: 'docker-from-zero-to-hero',
      title: 'Docker: Du Débutant au Pro',
      description: 'Un guide clair pour comprendre Docker, créer des images optimisées et gérer vos conteneurs.',
      date: '2024-12-30',
      file: 'docker-from-zero-to-hero.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Docker', 'DevOps', 'Containers'],
      coverImage: 'assets/images/no_image_available.png',
      readingTime: 10,
    },
  ];

  constructor(private http: HttpClient) { }

  getAllArticles(): Observable<Article[]> {
    return of(this.articles);
  }

  getArticleById(id: string): Observable<Article | undefined> {
    return this.getAllArticles().pipe(
      map(articles => articles.find(article => article.id === id))
    );
  }

  getArticleContent(filename: string): Observable<string> {
    return this.http.get(`assets/articles/${filename}`, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Error loading article:', error);
          return of('# Article not found\n\nThe requested article could not be loaded.');
        })
      );
  }

  getRecentArticles(limit: number = 3): Observable<Article[]> {
    return this.getAllArticles().pipe(
      map(articles => articles.slice(0, limit))
    );
  }




  faCalendar = faCalendar;
  faClock = faClock;
  faTag = faTag;
  faSearch = faSearch;
  faArrowRight = faArrowRight;

  filteredArticles: Article[] = [];
  searchQuery: string = '';
  selectedTag: string = '';
  allTags: string[] = [];


  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.filteredArticles = this.articles;
    this.extractTags();
  }

  extractTags(): void {
    const tagsSet = new Set<string>();
    this.articles.forEach(article => {
      article.tags?.forEach(tag => tagsSet.add(tag));
    });
    this.allTags = Array.from(tagsSet);
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value.toLowerCase();
    this.filterArticles();
  }

  filterByTag(tag: string): void {
    this.selectedTag = this.selectedTag === tag ? '' : tag;
    this.filterArticles();
  }

  filterArticles(): void {
    this.filteredArticles = this.articles.filter(article => {
      const matchesSearch = !this.searchQuery ||
        article.title.toLowerCase().includes(this.searchQuery) ||
        article.description.toLowerCase().includes(this.searchQuery);

      const matchesTag = !this.selectedTag ||
        article.tags?.includes(this.selectedTag);

      return matchesSearch && matchesTag;
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
