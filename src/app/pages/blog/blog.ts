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
  faArrowRight, faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { Header } from '../../components/header/header';
import { ArticlesService } from '../../services/articles-service';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-blog',
  imports: [CommonModule, RouterModule, FontAwesomeModule, Header, Footer],
  templateUrl: './blog.html',
  styles: ``,
})
export class Blog {


  constructor(private http: HttpClient, private articlesService: ArticlesService) { }


  faCalendar = faCalendar;
  faClock = faClock;
  faTag = faTag;
  faSearch = faSearch;
  faArrowRight = faArrowRight;
  faRefresh = faRefresh;

  articles: Article[] = [];
  filteredArticles: Article[] = [];
  searchQuery: string = '';
  selectedTag: string = '';
  allTags: string[] = [];


  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articlesService.getAllArticles().subscribe(articles => {
      // this.articles = articles;
      // this.filteredArticles = articles;
      this.extractTags();
    });
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
