import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LowerCasePipe, SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendar,
  faClock,
  faTag,
  faSearch,
  faArrowRight,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Article } from '../../models/article.model';
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { ArticlesService } from '../../services/articles.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-blog',
  imports: [
    LowerCasePipe, SlicePipe,
    RouterModule,
    FontAwesomeModule,
    Header,
    Footer,
    TranslateModule
  ],
  templateUrl: './blog.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class Blog implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translateService = inject(TranslateService);

  constructor(
    private articlesService: ArticlesService,
    private languageService: LanguageService
  ) {}

  faCalendar = faCalendar;
  faClock = faClock;
  faTag = faTag;
  faSearch = faSearch;
  faArrowRight = faArrowRight;
  faRefresh = faRefresh;

  articles: Article[] = [];
  filteredArticles: Article[] = [];

  isLoading = true;
  readonly skeletonCards = Array.from({ length: 6 }, (_, i) => i);

  searchQuery = '';
  selectedTag = '';
  allTags: string[] = [];

  ngOnInit(): void {
    // Served from the service cache when the articles were already
    // loaded in the current language.
    this.loadArticles();

    // A new language means a different cache entry, so fetch again.
    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadArticles());
  }

  /**
   * @param forceRefresh bypass the cache (used by the "Refresh" button).
   */
  loadArticles(forceRefresh = false): void {
    this.isLoading = true;

    this.articlesService.getAllArticles(forceRefresh)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: articles => {
        this.isLoading = false;
        this.articles = articles;

        this.filteredArticles = [...this.articles];
        this.extractTags();
        this.filterArticles();
      },
      error: error => {
        console.error('Error loading articles:', error);
        this.isLoading = false;
        this.articles = [];
        this.filteredArticles = [];
        this.allTags = [];
      }
    });
  }

  extractTags(): void {
    const categories = new Set<string>();

    this.articles.forEach(article => {
      article.categories?.forEach(category => categories.add(category));
    });

    this.allTags = Array.from(categories);
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
      const matchesSearch =
        !this.searchQuery ||
        article.title.toLowerCase().includes(this.searchQuery) ||
        article.description.toLowerCase().includes(this.searchQuery);

      const matchesTag =
        !this.selectedTag ||
        article.categories?.includes(this.selectedTag);

      return matchesSearch && matchesTag;
    });
  }

  formatDate(dateString: string): string {
    return this.languageService.formatDate(dateString);
  }

  getArticleShortenedTitle(title: string): string {
    const match = title.match(/\bPart\s+[IVXLCDM]+\b/i);

    if (!match) {
      return '';
    }

    const part = match[0];
    const titleWithoutPart = title.replace(part, '').trim();

    return `${titleWithoutPart.substring(0, 36).trim()} ... ${part}`;
  }
}