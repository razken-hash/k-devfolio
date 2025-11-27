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
      file: 'assets/articles/spring-boot-microservices/spring-boot-microservices.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Spring Boot', 'Microservices', 'Backend'],
      coverImage: 'assets/articles/spring-boot-microservices/images/spring-boot-microservices.webp',
      readingTime: 10,
    },
    {
      id: 'flutter-state-management',
      title: 'State Management dans Flutter',
      description: 'Comparaison des solutions de gestion d\'état dans Flutter : BLoC, Provider, Riverpod.',
      date: '2025-01-05',
      file: 'assets/articles/flutter-state-management/flutter-state-management.md',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Flutter', 'Dart', 'Mobile'],
      coverImage: 'assets/articles/flutter-state-management/images/flutter-state-management.webp',
      readingTime: 7,
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