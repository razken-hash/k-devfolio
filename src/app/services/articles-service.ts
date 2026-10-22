
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import {
  Article,
  ArticleLanguage,
  FullArticle
} from '../models/article.model';

import { LanguageService } from './language-service';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);

  private readonly apiUrl =
    `${environment.backendUrl}/blog/articles`;

  /**
   * Get the current frontend language in the format
   * expected by the Spring Boot API.
   */
  private getCurrentApiLanguage(): ArticleLanguage {
    const language = this.languageService
      .getCurrentLanguageCode()
      .toUpperCase();

    const supportedLanguages: ArticleLanguage[] = [
      'EN', 'ES', 'FR', 'TR'
    ];

    return supportedLanguages.includes(language as ArticleLanguage)
      ? language as ArticleLanguage
      : 'EN';
  }

  /**
   * Build request parameters using the current language.
   */
  private getLanguageParams(
    language: ArticleLanguage = this.getCurrentApiLanguage()
  ): HttpParams {
    return new HttpParams().set('language', language);
  }

  /**
   * Get all article summaries in the current language.
   */
  getAllArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(
      this.apiUrl,
      // { params: this.getLanguageParams() }
    ).pipe(
      tap(articles => {
        console.log('[ArticlesService] Articles received:', articles);
        console.log('[ArticlesService] Number of articles:', articles.length);
      }),
      catchError(error => {
        console.error('[ArticlesService] Failed to fetch articles:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a complete article by slug.
   */
  getArticleBySlug(
    slug: string,
    language: ArticleLanguage = this.getCurrentApiLanguage()
  ): Observable<FullArticle> {
    return this.http.get<FullArticle>(
      `${this.apiUrl}/slug/${encodeURIComponent(slug)}`,
      { params: this.getLanguageParams(language) }
    );
  }

  /**
   * Get a complete article by ID.
   */
  getArticleById(
    id: string,
    language: ArticleLanguage = this.getCurrentApiLanguage()
  ): Observable<FullArticle> {
    return this.http.get<FullArticle>(
      `${this.apiUrl}/${encodeURIComponent(id)}`,
      { params: this.getLanguageParams(language) }
    );
  }

  /**
   * Get articles belonging to a category.
   */
  getArticlesByCategory(
    categorySlug: string
  ): Observable<Article[]> {
    return this.http.get<Article[]>(
      `${this.apiUrl}/category/${encodeURIComponent(categorySlug)}`,
      { params: this.getLanguageParams() }
    );
  }

  /**
   * Load Markdown content from a local asset.
   */
  getArticleContent(filename: string): Observable<string> {
    return this.http.get(filename, { responseType: 'text' }).pipe(
      catchError(error => {
        console.error('[ArticlesService] Error loading article content:', error);

        return of(
          '# Article not found\n\nThe requested article could not be loaded.'
        );
      })
    );
  }

  /**
   * Backward-compatible alias for components using the old method.
   */
  getArticlesByTag(tag: string): Observable<Article[]> {
    return this.getArticlesByCategory(tag);
  }

  /**
   * Get the most recent articles.
   */
  getRecentArticles(limit: number = 3): Observable<Article[]> {
    return this.getAllArticles().pipe(
      map(articles =>
        [...articles]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
          .slice(0, Math.max(0, limit))
      )
    );
  }
}
