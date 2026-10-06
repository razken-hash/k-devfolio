import {
  Component,
  DestroyRef,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterModule
} from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
  faCalendar,
  faClock,
  faTag,
  faArrowLeft,
  faShareNodes
} from '@fortawesome/free-solid-svg-icons';

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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import mermaid from 'mermaid';

import { MermaidStyleService } from './mermaid-style-service';
import { MERMAID_CONFIG } from './mermaid-theme';

import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-article',
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    Header,
    TranslateModule,
    MatSnackBarModule
  ],
  templateUrl: './article.html'
})
export class ArticleComponent implements OnInit {
  faCalendar = faCalendar;
  faClock = faClock;
  faTag = faTag;
  faArrowLeft = faArrowLeft;
  faShareNodes = faShareNodes;

  article?: Article;
  content: SafeHtml = '';
  sectionNavigation: SafeHtml = '';

  loading = true;
  showShareMenu = false;

  private readonly destroyRef = inject(DestroyRef);

  private sectionObserver?: IntersectionObserver;
  private activeSectionId: string | null = null;

  /**
   * Original article ID from the route.
   *
   * This must remain unchanged when switching languages.
   */
  private articleId = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private articlesService: ArticlesService,
    private markdownConverter: MarkdownConverterService,
    private translateService: TranslateService,
    private languageService: LanguageService,
    private meta: Meta,
    private title: Title,
    private sanitizer: DomSanitizer,
    private mermaidStyle: MermaidStyleService,
    private snackBar: MatSnackBar
  ) {
    mermaid.initialize(MERMAID_CONFIG);
  }

  ngOnInit(): void {
    /**
     * Load article when the route changes.
     */
    this.activatedRoute.params
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(params => {
        this.articleId = params['articleId'];

        if (this.articleId) {
          this.loadArticle(this.articleId);
        }
      });

    /**
     * Reload the article whenever the website
     * language changes.
     *
     * LanguageService calls translate.use(code),
     * which triggers TranslateService.onLangChange.
     */
    this.translateService.onLangChange
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.articleId) {
          this.loadArticle(this.articleId);
        }
      });
  }

  loadArticle(id: string): void {
    this.loading = true;

    this.sectionNavigation = '';
    this.activeSectionId = null;

    this.sectionObserver?.disconnect();

    this.articlesService.getArticleById(id).subscribe({
      next: article => {
        if (!article) {
          this.loading = false;
          return;
        }

        const language =
          this.languageService.getCurrentLanguageCode();

        /**
         * Do NOT modify the original article object.
         *
         * Base:
         *   docker-base-images
         *
         * French:
         *   docker-base-images-fr.md
         *
         * English:
         *   docker-base-images-en.md
         */
        this.article = {
          ...article,
          file: `${article.file}-${language}.md`,
          coverImage: `${article.coverImage}-${language}.png`
        };

        this.updateMetaTags();

        this.loadContent(this.article.file);
      },

      error: error => {
        console.error(
          'Failed to load article:',
          error
        );

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
        console.error(
          'Failed to load article content:',
          error
        );

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
        await this.renderMermaidDiagrams(
          contentWithMermaid
        );

      const finalContent =
        this.buildSectionsUrlsSkeletons(
          renderedContent
        );

      this.content =
        this.sanitizer.bypassSecurityTrustHtml(
          finalContent
        );

      this.loading = false;

      setTimeout(() => {
        this.observeSections();
      });
    } catch (error) {
      console.error(
        'Failed to process Markdown content:',
        error
      );

      this.loading = false;
    }
  }

  buildSectionsUrlsSkeletons(html: string): string {
    const container =
      document.createElement('div');

    container.innerHTML = html;

    const headings =
      container.querySelectorAll<HTMLElement>(
        '.markdown-heading > h1, .markdown-heading > h2, .markdown-heading > h3'
      );

    const sectionsContainer =
      document.createElement('div');

    sectionsContainer.className =
      'sections-navigation';

    let currentSection: HTMLDivElement | null = null;
    let sectionIndex = 0;

    headings.forEach(heading => {
      const tagName =
        heading.tagName.toLowerCase();

      const isMainSection =
        tagName === 'h1' ||
        tagName === 'h2';

      const isSubsection =
        tagName === 'h3';

      const id =
        heading.id ||
        `section-${sectionIndex++}`;

      heading.id = id;

      const button =
        document.createElement('button');

      button.type = 'button';

      button.className = isMainSection
        ? 'section-url-skeleton'
        : 'section-subsection-skeleton';

      button.setAttribute(
        'data-section-id',
        id
      );

      button.setAttribute(
        'aria-label',
        `Go to ${isSubsection
          ? 'subsection'
          : 'section'
        } ${heading.textContent?.trim() || ''
        }`
      );

      if (isMainSection) {
        currentSection =
          document.createElement('div');

        currentSection.className =
          'section-navigation-group';

        const mainContainer =
          document.createElement('div');

        mainContainer.className =
          'section-navigation-main';

        mainContainer.appendChild(button);

        currentSection.appendChild(
          mainContainer
        );

        sectionsContainer.appendChild(
          currentSection
        );
      }

      if (
        isSubsection &&
        currentSection
      ) {
        let subsectionsContainer =
          currentSection.querySelector<HTMLDivElement>(
            '.section-navigation-subsections'
          );

        if (!subsectionsContainer) {
          subsectionsContainer =
            document.createElement('div');

          subsectionsContainer.className =
            'section-navigation-subsections';

          currentSection.appendChild(
            subsectionsContainer
          );
        }

        subsectionsContainer.appendChild(
          button
        );
      }
    });

    this.sectionNavigation =
      this.sanitizer.bypassSecurityTrustHtml(
        sectionsContainer.innerHTML
      );

    return container.innerHTML;
  }

  private observeSections(): void {
    this.sectionObserver?.disconnect();

    const headings =
      Array.from(
        document.querySelectorAll<HTMLElement>(
          '.markdown-body .markdown-heading > h1, .markdown-body .markdown-heading > h2, .markdown-body .markdown-heading > h3'
        )
      );

    if (!headings.length) {
      return;
    }

    this.sectionObserver =
      new IntersectionObserver(
        entries => {
          const visibleEntries =
            entries
              .filter(
                entry =>
                  entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  a.boundingClientRect.top -
                  b.boundingClientRect.top
              );

          if (visibleEntries.length) {
            this.setActiveSection(
              visibleEntries[0].target.id
            );
          }
        },
        {
          root: null,
          rootMargin:
            '-100px 0px -70% 0px',
          threshold: 0
        }
      );

    headings.forEach(heading => {
      this.sectionObserver?.observe(
        heading
      );
    });

    this.updateActiveSection();
  }

  private setActiveSection(
    sectionId: string
  ): void {
    if (
      this.activeSectionId ===
      sectionId
    ) {
      return;
    }

    this.activeSectionId = sectionId;

    this.updateActiveSection();
  }

  private updateActiveSection(): void {
    const navigation =
      document.getElementById(
        'sections-urls-skeletons'
      );

    if (!navigation) {
      return;
    }

    const buttons =
      navigation.querySelectorAll<HTMLButtonElement>(
        '[data-section-id]'
      );

    buttons.forEach(button => {
      const sectionId =
        button.getAttribute(
          'data-section-id'
        );

      button.classList.toggle(
        'active-section',
        sectionId ===
        this.activeSectionId
      );
    });
  }

  onSectionNavigationClick(
    event: MouseEvent
  ): void {
    const target =
      event.target as HTMLElement;

    const button =
      target.closest<HTMLButtonElement>(
        '[data-section-id]'
      );

    if (!button) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const sectionId =
      button.getAttribute(
        'data-section-id'
      );

    if (!sectionId) {
      return;
    }

    const section =
      document.getElementById(
        sectionId
      );

    if (!section) {
      console.warn(
        `Section with id "${sectionId}" was not found`
      );

      return;
    }

    this.setActiveSection(
      sectionId
    );

    const headerOffset = 100;

    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY -
      headerOffset;

    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth'
    });
  }

  private async renderMermaidDiagrams(
    content: string
  ): Promise<string> {
    const container =
      document.createElement('div');

    container.innerHTML = content;

    const mermaidBlocks =
      container.querySelectorAll(
        'code.language-mermaid'
      );

    for (
      let i = 0;
      i < mermaidBlocks.length;
      i++
    ) {
      const codeElement =
        mermaidBlocks[i];

      const mermaidCode =
        codeElement.textContent?.trim();

      if (!mermaidCode) {
        console.warn(
          `Mermaid block ${i + 1} is empty`
        );

        continue;
      }

      try {
        let id: string;

        try {
          id =
            `mermaid-${crypto.randomUUID()}`;
        } catch {
          id =
            `mermaid-${Date.now()}-${i}-${Math.random()
              .toString(36)
              .substring(2, 9)}`;
        }

        const { svg } =
          await mermaid.render(
            id,
            mermaidCode
          );

        const wrapper =
          codeElement.closest(
            '.highlight-source-mermaid'
          );

        if (!wrapper) {
          console.warn(
            `No Mermaid wrapper found for diagram ${i + 1
            }`
          );

          continue;
        }

        const svgContainer =
          document.createElement('div');

        svgContainer.className =
          'mermaid-container';

        svgContainer.innerHTML =
          this.mermaidStyle.enhance(
            svg
          );

        wrapper.replaceWith(
          svgContainer
        );
      } catch (error) {
        console.error(
          `Failed to render Mermaid diagram ${i + 1
          }:`,
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

  formatDate(
    dateString: string
  ): string {
    return this.languageService.formatDate(
      dateString
    );
  }

  toggleShareMenu(): void {
    this.showShareMenu =
      !this.showShareMenu;
  }

  shareOn(platform: string): void {
    const url =
      window.location.href;

    const title =
      this.article?.title || '';

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
      .writeText(
        window.location.href
      )
      .then(() => {
        this.snackBar.open(
          'Article Link Copied Successfully!',
          undefined,
          {
            duration: 2000,
            horizontalPosition:
              'center',
            verticalPosition:
              'bottom',
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
          }
        );
      })
      .catch(error => {
        console.error(
          'Failed to copy link:',
          error
        );
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
