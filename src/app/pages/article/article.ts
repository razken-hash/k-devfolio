import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendar,
  faClock,
  faTag,
  faArrowLeft,
  faShareNodes
} from '@fortawesome/free-solid-svg-icons';
import {
  faTwitter,
  faLinkedin,
  faFacebook
} from '@fortawesome/free-brands-svg-icons';
import { Article } from '../../models/article.model';
import { Meta, Title } from '@angular/platform-browser';
import { Header } from '../../components/header/header';
import { ArticlesService } from '../../services/articles-service';
import { MarkdownConverterService } from '../../services/markdown-converter-service';


@Component({
  selector: 'app-article',
  imports: [CommonModule, RouterModule, FontAwesomeModule, Header],
  templateUrl: './article.html',
})
export class ArticleComponent implements OnInit {
  faCalendar = faCalendar;
  faClock = faClock;
  faTag = faTag;
  faArrowLeft = faArrowLeft;
  faShareNodes = faShareNodes;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faFacebook = faFacebook;

  article?: Article;
  content: string = '';
  loading: boolean = true;
  showShareMenu: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private articlesService: ArticlesService,
    private markdownConverter: MarkdownConverterService,
    private meta: Meta,
    private title: Title
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const articleId = params['articleId'];
      this.loadArticle(articleId);
    });
  }

  loadArticle(id: string): void {
    this.loading = true;
    this.articlesService.getArticleById(id).subscribe(article => {
      if (article) {
        this.article = article;
        this.updateMetaTags();
        this.loadContent(article.file);
      } else {
        this.loading = false;
      }
    });
  }

  loadContent(filename: string): void {
    this.articlesService.getArticleContent(filename).subscribe(content => {
      this.convertMarkdownToHtml(content);
      this.loading = false;
    });
  }

  convertMarkdownToHtml(md: string): void {
    this.markdownConverter.convertMarkdownToHtml(md).subscribe(content => {
      this.content = content;
      console.log(this.content);
    });
  }


  updateMetaTags(): void {
    if (this.article) {
      this.title.setTitle(`${this.article.title} | Blog`);
      this.meta.updateTag({ name: 'description', content: this.article.description });
      this.meta.updateTag({ property: 'og:title', content: this.article.title });
      this.meta.updateTag({ property: 'og:description', content: this.article.description });
      if (this.article.coverImage) {
        this.meta.updateTag({ property: 'og:image', content: this.article.coverImage });
      }
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  toggleShareMenu(): void {
    this.showShareMenu = !this.showShareMenu;
  }

  shareOn(platform: string): void {
    const url = window.location.href;
    const title = this.article?.title || '';

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href);
    alert('Lien copié!');
  }
}