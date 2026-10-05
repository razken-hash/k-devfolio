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
import {
  Meta,
  Title,
  DomSanitizer,
  SafeHtml
} from '@angular/platform-browser';
import { Header } from '../../components/header/header';
import { ArticlesService } from '../../services/articles-service';
import { MarkdownConverterService } from '../../services/markdown-converter-service';
import { LanguageService } from '../../services/language-service';
import {
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import mermaid from 'mermaid';
import { MermaidStyleService } from './mermaid-style-service';
import { MERMAID_CONFIG } from './mermaid-theme';

@Component({
  selector: 'app-article',
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    Header,
    TranslateModule
  ],
  templateUrl: './article.html'
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
  content: SafeHtml = '';
  sectionNavigation: SafeHtml = '';
  loading = true;
  showShareMenu = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private articlesService: ArticlesService,
    private markdownConverter: MarkdownConverterService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private meta: Meta,
    private title: Title,
    private sanitizer: DomSanitizer,
    private mermaidStyle: MermaidStyleService
  ) {
    mermaid.initialize(MERMAID_CONFIG);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      const articleId = params['articleId'];
      this.loadArticle(articleId);
    });
  }

  loadArticle(id: string): void {
    this.loading = true;
    this.sectionNavigation = '';

    this.articlesService.getArticleById(id).subscribe({
      next: article => {
        if (!article) {
          this.loading = false;
          return;
        }

        this.article = article;
        this.updateMetaTags();
        this.loadContent(article.file);
      },
      error: error => {
        console.error('Failed to load article:', error);
        this.loading = false;
      }
    });
  }

  loadContent(filename: string): void {
    this.articlesService.getArticleContent(filename).subscribe({
      next: content => {
        this.convertMarkdownToHtml(content);
      },
      error: error => {
        console.error('Failed to load article content:', error);
        this.loading = false;
      }
    });
  }

  async convertMarkdownToHtml(md: string): Promise<void> {
    try {
      const html = await firstValueFrom(
        this.markdownConverter.convertMarkdownToHtml(md)
      );

      const contentWithMermaid =
        this.markdownConverter.processMermaidBlocks(html);

      const renderedContent =
        await this.renderMermaidDiagrams(contentWithMermaid);

      const finalContent =
        this.buildSectionsUrlsSkeletons(renderedContent);

      this.content =
        this.sanitizer.bypassSecurityTrustHtml(finalContent);

      this.loading = false;
    } catch (error) {
      console.error('Failed to process Markdown content:', error);
      this.loading = false;
    }
  }

  buildSectionsUrlsSkeletons(html: string): string {
    const container = document.createElement('div');
    container.innerHTML = html;

    const elements =
      container.querySelectorAll<HTMLElement>('.markdown-heading>h1, .markdown-heading>h2');

    const sectionsContainer = document.createElement('div');
    sectionsContainer.className = 'sections-urls-skeletons';

    elements.forEach((element, index) => {
      const id = element.id || `section-${index}`;
      element.id = id;

      const skeleton = document.createElement('button');
      skeleton.type = 'button';
      skeleton.className = 'section-url-skeleton';
      skeleton.dataset['id'] = id;
      skeleton.setAttribute(
        'aria-label',
        `Go to section ${index + 1}`
      );

      sectionsContainer.appendChild(skeleton);
    });

    this.sectionNavigation =
      this.sanitizer.bypassSecurityTrustHtml(
        sectionsContainer.innerHTML
      );

    return container.innerHTML;
  }

  onSectionNavigationClick(event: Event): void {
    const target = event.target as HTMLElement;

    const button =
      target.closest<HTMLButtonElement>(
        '.section-url-skeleton'
      );

    if (!button) {
      return;
    }

    const sectionId = button.dataset['id'];

    if (!sectionId) {
      return;
    }

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const header = document.querySelector('app-header');
    const headerHeight = 80;

    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY;

    window.scrollTo({
      top: sectionTop + headerHeight,
      behavior: 'smooth'
    });
  }

  private async renderMermaidDiagrams(
    content: string
  ): Promise<string> {
    const container = document.createElement('div');
    container.innerHTML = content;

    const mermaidBlocks =
      container.querySelectorAll('code.language-mermaid');

    for (let i = 0; i < mermaidBlocks.length; i++) {
      const codeElement = mermaidBlocks[i];
      const mermaidCode = codeElement.textContent?.trim();

      if (!mermaidCode) {
        console.warn(`Mermaid block ${i + 1} is empty`);
        continue;
      }

      try {
        let id: string;

        try {
          id = `mermaid-${crypto.randomUUID()}`;
        } catch {
          id =
            `mermaid-${Date.now()}-${i}-${Math.random()
              .toString(36)
              .substring(2, 9)}`;
        }

        const { svg } = await mermaid.render(
          id,
          mermaidCode
        );

        const wrapper =
          codeElement.closest(
            '.highlight-source-mermaid'
          );

        if (!wrapper) {
          console.warn(
            `No Mermaid wrapper found for diagram ${i + 1}`
          );
          continue;
        }

        const svgContainer = document.createElement('div');
        svgContainer.className = 'mermaid-container';
        svgContainer.innerHTML =
          this.mermaidStyle.enhance(svg);

        wrapper.replaceWith(svgContainer);
      } catch (error) {
        console.error(
          `Failed to render Mermaid diagram ${i + 1}:`,
          error
        );
      }
    }

    return container.innerHTML;
  }

  updateMetaTags(): void {
    if (!this.article) {
      return;
    }

    this.title.setTitle(
      `${this.article.title} | Blog`
    );

    this.meta.updateTag({
      name: 'description',
      content: this.article.description
    });

    this.meta.updateTag({
      property: 'og:title',
      content: this.article.title
    });

    this.meta.updateTag({
      property: 'og:description',
      content: this.article.description
    });

    if (this.article.coverImage) {
      this.meta.updateTag({
        property: 'og:image',
        content: this.article.coverImage
      });
    }
  }

  formatDate(dateString: string): string {
    return this.languageService.formatDate(dateString);
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
        shareUrl =
          `https://twitter.com/intent/tweet?` +
          `url=${encodeURIComponent(url)}` +
          `&text=${encodeURIComponent(title)}`;
        break;

      case 'linkedin':
        shareUrl =
          `https://www.linkedin.com/sharing/share-offsite/?` +
          `url=${encodeURIComponent(url)}`;
        break;

      case 'facebook':
        shareUrl =
          `https://www.facebook.com/sharer/sharer.php?` +
          `u=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(
        shareUrl,
        '_blank',
        'width=600,height=400'
      );
    }
  }

  copyLink(): void {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert('Lien copié!');
      })
      .catch(error => {
        console.error('Failed to copy link:', error);
      });
  }

  get getMadeWithLoveByText(): string {
    const author =
      this.article?.author ||
      this.translateService.instant(
        'HERO.KENNICHE_ABDERRAZAK'
      );

    return this.translateService.instant(
      'OTHERS.BY_ENTITY',
      {
        ENTITY:
          '<span class="text-lime-400 font-semibold">' +
          author +
          '</span>'
      }
    );
  }
}
