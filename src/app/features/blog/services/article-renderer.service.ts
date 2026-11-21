import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import mermaid from 'mermaid';

import { MERMAID_CONFIG } from '../config/mermaid-theme';
import { MarkdownConverterService } from './markdown-converter.service';
import { MermaidStyleService } from './mermaid-style.service';

export interface RenderedArticle {
  /** Article body HTML (GitHub-flavoured, with diagrams and code headers). */
  html: string;
  /** HTML for the "sections" sidebar built from the article headings. */
  navigation: string;
}

/**
 * Turns an article's Markdown into the HTML shown on the article page:
 * GitHub Markdown rendering, Mermaid diagrams, code-block headers with a
 * copy button, and a section navigation built from the headings.
 */
@Injectable({
  providedIn: 'root'
})
export class ArticleRendererService {
  private readonly markdownConverter = inject(MarkdownConverterService);
  private readonly mermaidStyle = inject(MermaidStyleService);

  private static readonly LANGUAGE_LABELS: Record<string, string> = {
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

  constructor() {
    mermaid.initialize(MERMAID_CONFIG);
  }

  /**
   * Convert Markdown to HTML, render Mermaid diagrams,
   * enhance code blocks and create the section navigation.
   */
  async render(markdown: string): Promise<RenderedArticle> {
    const html = await firstValueFrom(
      this.markdownConverter.convertMarkdownToHtml(markdown)
    );

    const contentWithMermaid = this.markdownConverter.processMermaidBlocks(html);
    const renderedContent = await this.renderMermaidDiagrams(contentWithMermaid);
    const enhancedContent = this.enhanceCodeBlocks(renderedContent);

    return this.buildSectionNavigation(enhancedContent);
  }

  /**
   * Delegate code-copy clicks from the rendered Markdown container.
   * Safe to call several times: the listener is attached only once.
   */
  attachCodeCopyHandler(markdownBody: Element): void {
    if (markdownBody.getAttribute('copyListenerAttached') === 'true') {
      return;
    }

    markdownBody.setAttribute('copyListenerAttached', 'true');

    markdownBody.addEventListener('click', async event => {
      const target = event.target as HTMLElement;
      const button = target.closest<HTMLButtonElement>('.code-block-copy');

      if (!button) {
        return;
      }

      const wrapper = button.closest<HTMLElement>('.code-block-wrapper');

      if (!wrapper) {
        return;
      }

      const code = wrapper.querySelector('pre')?.textContent ?? '';

      try {
        await navigator.clipboard.writeText(code);

        const iconContainer = button.querySelector('.copy-icon');
        const label = button.querySelector('.copy-label');

        if (iconContainer) {
          iconContainer.innerHTML = icon(faCheck).html.join('');
        }

        if (label) {
          label.textContent = 'Copied';
        }

        button.classList.add('copied');

        setTimeout(() => {
          if (iconContainer) {
            iconContainer.innerHTML = icon(faCopy).html.join('');
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

  /**
   * Give every h1–h3 heading an id and build the section navigation from them.
   */
  private buildSectionNavigation(html: string): RenderedArticle {
    const container = document.createElement('div');
    container.innerHTML = html;

    const headings = container.querySelectorAll<HTMLElement>(
      '.markdown-heading > h1, .markdown-heading > h2, .markdown-heading > h3'
    );

    const sectionsContainer = document.createElement('div');
    sectionsContainer.className = 'sections-navigation';

    let currentSection: HTMLDivElement | null = null;
    let sectionIndex = 0;

    headings.forEach(heading => {
      const tagName = heading.tagName.toLowerCase();
      const isMainSection = tagName === 'h1' || tagName === 'h2';
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
        `Go to ${isSubsection ? 'subsection' : 'section'} ${heading.textContent?.trim() || ''}`
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
        let subsectionsContainer = currentSection.querySelector<HTMLDivElement>(
          '.section-navigation-subsections'
        );

        if (!subsectionsContainer) {
          subsectionsContainer = document.createElement('div');
          subsectionsContainer.className = 'section-navigation-subsections';
          currentSection.appendChild(subsectionsContainer);
        }

        subsectionsContainer.appendChild(button);
      }
    });

    return {
      html: container.innerHTML,
      navigation: sectionsContainer.innerHTML
    };
  }

  /**
   * Render Mermaid diagrams inside the generated HTML.
   */
  private async renderMermaidDiagrams(content: string): Promise<string> {
    const container = document.createElement('div');
    container.innerHTML = content;

    const mermaidBlocks = container.querySelectorAll('code.language-mermaid');

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
          id = `mermaid-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 9)}`;
        }

        const { svg } = await mermaid.render(id, mermaidCode);

        const wrapper = codeElement.closest('.highlight-source-mermaid');

        if (!wrapper) {
          console.warn(`No Mermaid wrapper found for diagram ${i + 1}`);
          continue;
        }

        const svgContainer = document.createElement('div');
        svgContainer.className = 'mermaid-container';
        svgContainer.innerHTML = this.mermaidStyle.enhance(svg);

        wrapper.replaceWith(svgContainer);
      } catch (error) {
        console.error(`Failed to render Mermaid diagram ${i + 1}:`, error);
      }
    }

    return container.innerHTML;
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
      if (block.parentElement?.classList.contains('code-block-wrapper')) {
        return;
      }

      const languageClass = Array.from(block.classList).find(className =>
        className.startsWith('highlight-source-')
      );

      if (!languageClass) {
        return;
      }

      const language = languageClass.replace('highlight-source-', '').toLowerCase();

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      const header = document.createElement('div');
      header.className = 'code-block-header';

      const languageElement = document.createElement('span');
      languageElement.className = 'code-block-language';
      languageElement.textContent =
        ArticleRendererService.LANGUAGE_LABELS[language] ?? language;

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
}
