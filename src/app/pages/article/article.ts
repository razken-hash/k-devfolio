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
  faShareNodes,
  faCopy,
  faCheck
} from '@fortawesome/free-solid-svg-icons';

import { icon } from '@fortawesome/fontawesome-svg-core';

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

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import mermaid from 'mermaid';

import { MermaidStyleService } from './mermaid-style-service';
import { MERMAID_CONFIG } from './mermaid-theme';

import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';

import { ArticleLanguage, FullArticle } from '../../models/article.model';

@Component({
  selector: 'app-article',
  standalone: true,
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
  faCopy = faCopy;
  faCheck = faCheck;

  article?: FullArticle;

  content: SafeHtml = '';
  sectionNavigation: SafeHtml = '';

  loading = true;
  showShareMenu = false;

  private readonly destroyRef = inject(DestroyRef);

  private sectionObserver?: IntersectionObserver;
  private activeSectionId: string | null = null;

  /**
   * Keep the original route slug when switching languages.
   */
  private articleSlug = '';

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly articlesService: ArticlesService,
    private readonly markdownConverter: MarkdownConverterService,
    private readonly translateService: TranslateService,
    private readonly languageService: LanguageService,
    private readonly meta: Meta,
    private readonly title: Title,
    private readonly sanitizer: DomSanitizer,
    private readonly mermaidStyle: MermaidStyleService,
    private readonly snackBar: MatSnackBar
  ) {
    mermaid.initialize(MERMAID_CONFIG);
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

    const language = this.getApiLanguage();

    this.articlesService
      .getArticleBySlug(slug, language)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: article => {
          this.article = {
            ...article,
            imageUrl: this.getLocalizedImageUrl(
              article.imageUrl,
              language
            )
          };

          this.updateMetaTags();

          void this.convertMarkdownToHtml(article.content);
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
   * Convert the application's current language code
   * to the language enum expected by the backend.
   */
  private getApiLanguage(): ArticleLanguage {
    const currentLanguage =
      this.languageService.getCurrentLanguageCode().toUpperCase();

    const supportedLanguages: ArticleLanguage[] = [
      'EN',
      'ES',
      'FR',
      'TR'
    ];

    if (
      supportedLanguages.includes(
        currentLanguage as ArticleLanguage
      )
    ) {
      return currentLanguage as ArticleLanguage;
    }

    return 'EN';
  }

  /**
   * Append the selected language to the image filename.
   *
   * Example:
   * image-name -> image-name-FR.png
   * image-name.png -> image-name-FR.png
   */
  private getLocalizedImageUrl(
    imageUrl: string,
    language: ArticleLanguage
  ): string {
    if (!imageUrl) {
      return '';
    }

    const lastSlash = imageUrl.lastIndexOf('/');
    const lastDot = imageUrl.lastIndexOf('.');

    if (lastDot > lastSlash) {
      const basePath = imageUrl.substring(0, lastDot);
      const extension = imageUrl.substring(lastDot);

      // Avoid appending the language twice.
      const localizedBasePath = basePath.replace(
        /-(en|es|fr|tr)$/i,
        ''
      );

      return `${localizedBasePath}-${language.toLowerCase()}${extension}`;
    }

    const localizedPath = imageUrl.replace(
      /-(en|es|fr|tr)$/i,
      ''
    );

    return `${localizedPath}-${language.toLowerCase()}.png`;
  }

  /**
   * Convert Markdown to HTML, render Mermaid diagrams,
   * enhance code blocks and create section navigation.
   */
  async convertMarkdownToHtml(md: string): Promise<void> {
    try {
      const html = await this.markdownConverter
        .convertMarkdownToHtml(md)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .toPromise();

      if (html === undefined) {
        throw new Error('Markdown conversion returned no content.');
      }

      const contentWithMermaid =
        this.markdownConverter.processMermaidBlocks(html);

      const renderedContent =
        await this.renderMermaidDiagrams(contentWithMermaid);

      const enhancedContent =
        this.enhanceCodeBlocks(renderedContent);

      const finalContent =
        this.buildSectionsUrlsSkeletons(enhancedContent);

      this.content =
        this.sanitizer.bypassSecurityTrustHtml(finalContent);

      this.loading = false;

      // Allow Angular to update the DOM before querying headings.
      setTimeout(() => {
        this.observeSections();
        this.setupCodeBlockCopy();
      });
    } catch (error) {
      console.error('Failed to process Markdown content:', error);
      this.loading = false;
    }
  }

  /**
   * Build the section navigation from Markdown headings.
   */
  buildSectionsUrlsSkeletons(html: string): string {
    const container = document.createElement('div');
    container.innerHTML = html;

    const headings =
      container.querySelectorAll<HTMLElement>(
        '.markdown-heading > h1, .markdown-heading > h2, .markdown-heading > h3'
      );

    const sectionsContainer = document.createElement('div');
    sectionsContainer.className = 'sections-navigation';

    let currentSection: HTMLDivElement | null = null;
    let sectionIndex = 0;

    headings.forEach(heading => {
      const tagName = heading.tagName.toLowerCase();

      const isMainSection =
        tagName === 'h1' || tagName === 'h2';

      const isSubsection = tagName === 'h3';

      const id = heading.id || `section-${sectionIndex++}`;
      heading.id = id;

      const button = document.createElement('button');
      button.type = 'button';

      button.className = isMainSection
        ? 'section-url-skeleton'
        : 'section-subsection-skeleton';

      button.setAttribute('data-section-id', id);

      button.setAttribute(
        'aria-label',
        `Go to ${isSubsection ? 'subsection' : 'section'} ${
          heading.textContent?.trim() || ''
        }`
      );

      if (isMainSection) {
        currentSection = document.createElement('div');
        currentSection.className = 'section-navigation-group';

        const mainContainer = document.createElement('div');
        mainContainer.className = 'section-navigation-main';

        mainContainer.appendChild(button);
        currentSection.appendChild(mainContainer);
        sectionsContainer.appendChild(currentSection);
      }

      if (isSubsection && currentSection) {
        let subsectionsContainer =
          currentSection.querySelector<HTMLDivElement>(
            '.section-navigation-subsections'
          );

        if (!subsectionsContainer) {
          subsectionsContainer = document.createElement('div');
          subsectionsContainer.className =
            'section-navigation-subsections';

          currentSection.appendChild(subsectionsContainer);
        }

        subsectionsContainer.appendChild(button);
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
          .sort(
            (a, b) =>
              a.boundingClientRect.top -
              b.boundingClientRect.top
          );

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
    const navigation = document.getElementById(
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
      const sectionId = button.getAttribute('data-section-id');

      button.classList.toggle(
        'active-section',
        sectionId === this.activeSectionId
      );
    });
  }

  onSectionNavigationClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    const button = target.closest<HTMLButtonElement>(
      '[data-section-id]'
    );

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

    const sectionTop =
      section.getBoundingClientRect().top +
      window.scrollY -
      headerOffset;

    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth'
    });
  }

  /**
   * Render Mermaid diagrams inside the generated HTML.
   */
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
          id = `mermaid-${Date.now()}-${i}-${Math.random()
            .toString(36)
            .substring(2, 9)}`;
        }

        const { svg } = await mermaid.render(id, mermaidCode);

        const wrapper = codeElement.closest(
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

        svgContainer.innerHTML = this.mermaidStyle.enhance(svg);

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
        content: new URL(
          this.article.imageUrl,
          document.baseURI
        ).href
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
        this.snackBar.open(
          'Article Link Copied Successfully!',
          undefined,
          {
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
          }
        );
      })
      .catch(error => {
        console.error('Failed to copy link:', error);
      });
  }

  get getMadeWithLoveByText(): string {
    const author =
      this.article?.authorName ||
      this.translateService.instant(
        'HERO.KENNICHE_ABDERRAZAK'
      );

    return this.translateService.instant('OTHERS.BY_ENTITY', {
      ENTITY:
        '<span class="text-lime-400 font-semibold">' +
        author +
        '</span>'
    });
  }

  /**
   * Return readable language names for code-block headers.
   */
  private getLanguageLabel(language: string): string {
    const languages: Record<string, string> = {
      dockerfile: 'Docker',
      docker: 'Docker',
      bash: 'Bash',
      shell: 'Shell',
      sh: 'Shell',
      javascript: 'JavaScript',
      js: 'JavaScript',
      typescript: 'TypeScript',
      ts: 'TypeScript',
      java: 'Java',
      python: 'Python',
      py: 'Python',
      html: 'HTML',
      css: 'CSS',
      scss: 'SCSS',
      json: 'JSON',
      yaml: 'YAML',
      yml: 'YAML',
      xml: 'XML',
      sql: 'SQL',
      markdown: 'Markdown',
      md: 'Markdown',
      plaintext: 'Text',
      text: 'Text'
    };

    return languages[language] ?? language;
  }

  /**
   * Add a language label and copy button to each code block.
   */
  private enhanceCodeBlocks(html: string): string {
    const container = document.createElement('div');
    container.innerHTML = html;

    const codeBlocks = container.querySelectorAll<HTMLElement>(
      '.highlight:not(.highlight-source-mermaid)'
    );

    codeBlocks.forEach(block => {
      if (
        block.parentElement?.classList.contains(
          'code-block-wrapper'
        )
      ) {
        return;
      }

      const languageClass = Array.from(block.classList).find(
        className =>
          className.startsWith('highlight-source-')
      );

      if (!languageClass) {
        return;
      }

      const language = languageClass
        .replace('highlight-source-', '')
        .toLowerCase();

      const languageLabel = this.getLanguageLabel(language);

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      const header = document.createElement('div');
      header.className = 'code-block-header';

      const languageElement = document.createElement('span');
      languageElement.className = 'code-block-language';
      languageElement.textContent = languageLabel;

      const copyButton = document.createElement('button');
      copyButton.className = 'code-block-copy';
      copyButton.type = 'button';
      copyButton.setAttribute('aria-label', 'Copy code');
      copyButton.setAttribute('title', 'Copy code');

      copyButton.innerHTML = `
        <span class="copy-icon">
          ${icon(faCopy).html.join('')}
        </span>
        <span class="copy-label">Copy</span>
      `;

      header.appendChild(languageElement);
      header.appendChild(copyButton);

      block.parentNode?.insertBefore(wrapper, block);

      wrapper.appendChild(header);
      wrapper.appendChild(block);

      block.classList.add('code-block-content');
    });

    return container.innerHTML;
  }

  /**
   * Delegate code-copy events from the Markdown container.
   */
  private setupCodeBlockCopy(): void {
    const markdownBody =
      document.querySelector('.markdown-body');

    if (!markdownBody) {
      return;
    }

    if (
      markdownBody.getAttribute('copyListenerAttached') === 'true'
    ) {
      return;
    }

    markdownBody.setAttribute('copyListenerAttached', 'true');

    markdownBody.addEventListener('click', async event => {
      const target = event.target as HTMLElement;

      const button = target.closest<HTMLButtonElement>(
        '.code-block-copy'
      );

      if (!button) {
        return;
      }

      const wrapper = button.closest<HTMLElement>(
        '.code-block-wrapper'
      );

      if (!wrapper) {
        return;
      }

      const code =
        wrapper.querySelector('pre')?.textContent ?? '';

      try {
        await navigator.clipboard.writeText(code);

        const iconContainer =
          button.querySelector('.copy-icon');

        const label =
          button.querySelector('.copy-label');

        if (iconContainer) {
          iconContainer.innerHTML = icon(faCheck).html.join('');
        }

        if (label) {
          label.textContent = 'Copied';
        }

        button.classList.add('copied');

        setTimeout(() => {
          if (iconContainer) {
            iconContainer.innerHTML =
              icon(faCopy).html.join('');
          }

          if (label) {
            label.textContent = 'Copy';
          }

          button.classList.remove('copied');
        }, 1500);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    });
  }
}