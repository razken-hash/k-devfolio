import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title, DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCalendar,
  faClock,
  faTag,
  faArrowLeft,
  faShareNodes
} from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Header } from '../../../../core/layout/header/header';
import { LanguageService } from '../../../../core/services/language.service';
import { ArticlesService } from '../../services/articles.service';
import { ArticleRendererService } from '../../services/article-renderer.service';
import { FullArticle } from '../../models/article.model';

@Component({
  selector: 'app-article',
  imports: [
    RouterModule,
    FontAwesomeModule,
    Header,
    TranslateModule,
    MatSnackBarModule
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './article.html'
})
export class ArticleComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly articlesService = inject(ArticlesService);
  private readonly renderer = inject(ArticleRendererService);
  private readonly translateService = inject(TranslateService);
  private readonly languageService = inject(LanguageService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  faCalendar = faCalendar;
  faClock = faClock;
  faTag = faTag;
  faArrowLeft = faArrowLeft;
  faShareNodes = faShareNodes;

  article?: FullArticle;

  content: SafeHtml = '';
  sectionNavigation: SafeHtml = '';

  loading = true;
  showShareMenu = false;

  private sectionObserver?: IntersectionObserver;
  private activeSectionId: string | null = null;
  private destroyed = false;

  /**
   * Keep the original route slug when switching languages.
   */
  private articleSlug = '';

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.sectionObserver?.disconnect();
    });
  }

  ngOnInit(): void {
    /**
     * Load an article whenever the route changes.
     * Supports both the new "slug" parameter and
     * the existing "articleId" parameter name.
     */
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const slug = params['slug'] ?? params['articleId'] ?? '';

        if (slug && slug !== this.articleSlug) {
          this.articleSlug = slug;
          this.loadArticle(slug);
        }
      });

    /**
     * Reload the article when the application language changes.
     */
    this.translateService.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.articleSlug) {
          this.loadArticle(this.articleSlug);
        }
      });
  }

  /**
   * Fetch the localized article from the backend.
   *
   * The API response includes the Markdown content,
   * so no local Markdown file request is required.
   */
  loadArticle(slug: string): void {
    this.loading = true;

    this.sectionNavigation = '';
    this.content = '';
    this.activeSectionId = null;

    this.sectionObserver?.disconnect();

    const language = this.articlesService.getCurrentApiLanguage();

    this.articlesService
      .getArticleBySlug(slug, language)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: article => {
          this.article = {
            ...article,
            imageUrl: this.articlesService.localizeImageUrl(article.imageUrl, language)
          };

          this.updateMetaTags();

          void this.renderContent(article.content);
        },

        error: error => {
          console.error('Failed to load article:', error);

          this.article = undefined;
          this.content = '';
          this.sectionNavigation = '';
          this.loading = false;
        }
      });
  }

  /**
   * Render the Markdown and wire up the page behaviours that depend on it.
   */
  private async renderContent(markdown: string): Promise<void> {
    try {
      const { html, navigation } = await this.renderer.render(markdown);

      if (this.destroyed) {
        return;
      }

      this.content = this.sanitizer.bypassSecurityTrustHtml(html);
      this.sectionNavigation = this.sanitizer.bypassSecurityTrustHtml(navigation);
      this.loading = false;

      // Allow Angular to update the DOM before querying headings.
      setTimeout(() => {
        this.observeSections();

        const markdownBody = document.querySelector('.markdown-body');

        if (markdownBody) {
          this.renderer.attachCodeCopyHandler(markdownBody);
        }
      });
    } catch (error) {
      console.error('Failed to process Markdown content:', error);
      this.loading = false;
    }
  }

  private observeSections(): void {
    this.sectionObserver?.disconnect();

    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.markdown-body .markdown-heading > h1, ' +
        '.markdown-body .markdown-heading > h2, ' +
        '.markdown-body .markdown-heading > h3'
      )
    );

    if (!headings.length) {
      return;
    }

    this.sectionObserver = new IntersectionObserver(
      entries => {
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleEntries.length) {
          this.setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-100px 0px -70% 0px',
        threshold: 0
      }
    );

    headings.forEach(heading => {
      this.sectionObserver?.observe(heading);
    });

    this.updateActiveSection();
  }

  private setActiveSection(sectionId: string): void {
    if (this.activeSectionId === sectionId) {
      return;
    }

    this.activeSectionId = sectionId;
    this.updateActiveSection();
  }

  private updateActiveSection(): void {
    const navigation = document.getElementById('sections-urls-skeletons');

    if (!navigation) {
      return;
    }

    const buttons = navigation.querySelectorAll<HTMLButtonElement>('[data-section-id]');

    buttons.forEach(button => {
      const sectionId = button.getAttribute('data-section-id');

      button.classList.toggle('active-section', sectionId === this.activeSectionId);
    });
  }

  onSectionNavigationClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>('[data-section-id]');

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const sectionId = button.getAttribute('data-section-id');

    if (!sectionId) {
      return;
    }

    const section = document.getElementById(sectionId);

    if (!section) {
      console.warn(`Section with id "${sectionId}" was not found`);
      return;
    }

    this.setActiveSection(sectionId);

    const headerOffset = 100;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth'
    });
  }

  /**
   * Update browser title and social-sharing metadata.
   */
  updateMetaTags(): void {
    if (!this.article) {
      return;
    }

    this.title.setTitle(`${this.article.title} | Blog`);

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

    if (this.article.imageUrl) {
      this.meta.updateTag({
        property: 'og:image',
        content: new URL(this.article.imageUrl, document.baseURI).href
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
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  copyLink(): void {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        this.snackBar.open('Article Link Copied Successfully!', undefined, {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: [
            '!text-center',
            '!bg-emerald-800/90',
            '!text-lime-300',
            '!border',
            '!border-lime-400/40',
            '!rounded-2xl',
            '!shadow-lg',
            '!shadow-emerald-950/20',
            '!backdrop-blur-md'
          ]
        });
      })
      .catch(error => {
        console.error('Failed to copy link:', error);
      });
  }

  get getMadeWithLoveByText(): string {
    const author =
      this.article?.authorName ||
      this.translateService.instant('HERO.KENNICHE_ABDERRAZAK');

    return this.translateService.instant('OTHERS.BY_ENTITY', {
      ENTITY: '<span class="text-lime-400 font-semibold">' + author + '</span>'
    });
  }
}
