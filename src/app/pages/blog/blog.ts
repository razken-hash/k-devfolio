import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { TranslateModule } from '@ngx-translate/core';

import { Article } from '../../models/article.model';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { ArticlesService } from '../../services/articles-service';
import { LanguageService } from '../../services/language-service';

@Component({
  selector: 'app-blog',
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    Header,
    Footer,
    TranslateModule
  ],
  templateUrl: './blog.html',
  styles: ``
})
export class Blog implements OnInit {

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

  searchQuery = '';
  selectedTag = '';
  allTags: string[] = [];

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    const language = this.languageService.getCurrentLanguageCode();

    this.articlesService.getAllArticles().subscribe({
      next: articles => {
        this.articles = articles.map(article => ({
          ...article,
          imageUrl: this.getLocalizedImageUrl(article.imageUrl, language)
        }));

        this.filteredArticles = [...this.articles];
        this.extractTags();
      },
      error: error => {
        console.error('Error loading articles:', error);
        this.articles = [];
        this.filteredArticles = [];
        this.allTags = [];
      }
    });
  }

  private getLocalizedImageUrl(
    imageUrl: string,
    language: string
  ): string {
    const extensionIndex = imageUrl.lastIndexOf('.');
    const hasExtension = extensionIndex > imageUrl.lastIndexOf('/');

    if (hasExtension) {
      return `${imageUrl.substring(0, extensionIndex)}-${language}${imageUrl.substring(extensionIndex)}`;
    }

    return `${imageUrl}-${language}.png`;
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