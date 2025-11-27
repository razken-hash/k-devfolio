import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Article } from '../models/article.model';
import { MarkdownConverterService } from './markdown-converter-service';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private articles: Article[] = [
    {
      id: 'getting-started-angular',
      title: 'Getting Started with Angular 19',
      description: 'Un guide complet pour débuter avec Angular 18, couvrant les nouveautés et les meilleures pratiques.',
      date: '2025-01-15',
      file: 'assets/articles/getting-started-angular/getting-started-angular.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Angular', 'TypeScript', 'Frontend'],
      coverImage: 'assets/articles/getting-started-angular/images/getting-started-angular.webp',
      readingTime: 8,
    },
    {
      id: 'spring-boot-microservices',
      title: 'Microservices avec Spring Boot',
      description: 'Architecture microservices moderne avec Spring Boot, Docker et Kubernetes.',
      date: '2025-01-10',
      file: 'assets/articles/getting-started-angular/getting-started-angular.md',
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
      file: 'assets/articles/getting-started-angular/getting-started-angular.md',
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
      file: 'assets/articles/getting-started-angular/getting-started-angular.md',
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
      file: 'assets/articles/getting-started-angular/getting-started-angular.md',
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
      file: 'assets/articles/getting-started-angular/getting-started-angular.md',
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
      file: 'assets/articles/getting-started-angular/getting-started-angular.md',
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
      file: 'assets/articles/getting-started-angular/getting-started-angular.md',
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
      file: 'assets/articles/getting-started-angular/getting-started-angular.md',
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
      file: 'assets/articles/getting-started-angular/getting-started-angular.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Docker', 'DevOps', 'Containers'],
      coverImage: 'assets/images/no_image_available.png',
      readingTime: 10,
    },
  ];

  constructor(private http: HttpClient) { }

  getAllArticles(): Observable<Article[]> {
    // Option 1: Return hardcoded data
    return of(this.articles);

    // Option 2: Fetch from JSON file
    // return this.http.get<ArticleMetadata>('assets/articles/metadata.json')
    //   .pipe(map(data => data.articles));
  }

  getArticleById(id: string): Observable<Article | undefined> {
    return this.getAllArticles().pipe(
      map(articles => articles.find(article => article.id === id))
    );
  }

  getArticleContent(filename: string): Observable<string> {
    return this.http.get(filename, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Error loading article:', error);
          return of('# Article not found\n\nThe requested article could not be loaded.');
        })
      );
  }

  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  getArticlesByTag(tag: string): Observable<Article[]> {
    return this.getAllArticles().pipe(
      map(articles => articles.filter(article =>
        article.tags?.includes(tag)
      ))
    );
  }

  getRecentArticles(limit: number = 3): Observable<Article[]> {
    return this.getAllArticles().pipe(
      map(articles => articles.slice(0, limit))
    );
  }
}