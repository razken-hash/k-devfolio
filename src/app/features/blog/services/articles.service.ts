
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';

import {
  Article,
  ArticleLanguage,
  FullArticle
} from '../models/article.model';

import { LanguageService } from '../../../core/services/language.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);

  private readonly apiUrl =
    `${environment.backendUrl}/blog/articles`;

  /**
   * In-memory caches, keyed by language (and slug for full articles).
   * A cached request is reused until the language changes or a refresh
   * is forced, so revisiting the blog does not hit the API again.
   */
  private readonly articlesCache = new Map<ArticleLanguage, Observable<Article[]>>();
  private readonly articleBySlugCache = new Map<string, Observable<FullArticle>>();

  /**
   * Cache an observable under `key`, sharing a single request between
   * subscribers. Failed requests are evicted so they can be retried.
   */
  private cached<T>(
    cache: Map<string, Observable<T>>,
    key: string,
    factory: () => Observable<T>
  ): Observable<T> {
    const hit = cache.get(key);
    if (hit) {
      return hit;
    }

    const request$ = factory().pipe(
      catchError(error => {
        cache.delete(key);
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    cache.set(key, request$);
    return request$;
  }

  /**
   * Drop every cached article so the next calls hit the API again.
   */
  clearCache(): void {
    this.articlesCache.clear();
    this.articleBySlugCache.clear();
  }

  /**
   * Get the current frontend language in the format
   * expected by the Spring Boot API.
   */
  getCurrentApiLanguage(): ArticleLanguage {
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
  getAllArticles(forceRefresh = false): Observable<Article[]> {
    const language = this.getCurrentApiLanguage();

    if (forceRefresh) {
      this.articlesCache.delete(language);
    }

    return this.cached(this.articlesCache, language, () =>
      this.http.get<Article[]>(
        this.apiUrl,
        // { params: this.getLanguageParams(language) }
      ).pipe(
        tap(articles => {
          console.log('[ArticlesService] Articles received:', articles);
          console.log('[ArticlesService] Number of articles:', articles.length);
        }),
        catchError(error => {
          console.error('[ArticlesService] Failed to fetch articles:', error);
          return throwError(() => error);
        })
      )
    );
  }

  /**
   * Get a complete article by slug.
   */
  getArticleBySlug(
    slug: string,
    language: ArticleLanguage = this.getCurrentApiLanguage()
  ): Observable<FullArticle> {
    return this.cached(this.articleBySlugCache, `${language}:${slug}`, () =>
      this.http.get<FullArticle>(
        `${this.apiUrl}/slug/${encodeURIComponent(slug)}`,
        { params: this.getLanguageParams(language) }
      )
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
