import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarkdownConverterService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'https://api.github.com/markdown';
  private token: string | null = null;

  private loadGithubToken(): Observable<void> {
    return this.http
      .get<{ GITHUB_TOKEN: string }>('/.netlify/functions/get-environment')
      .pipe(
        map(data => {
          this.token = data.GITHUB_TOKEN;
        }),
        catchError(error => {
          console.error('Failed to retrieve GitHub token', error);
          return throwError(() => error);
        })
      );
  }

  convertMarkdownToHtml(md: string): Observable<string> {
    if (this.token) {
      return this.convertWithToken(md);
    }

    return this.loadGithubToken().pipe(
      switchMap(() => {
        if (this.token == null) {
          return throwError(() => new Error('GitHub token is not available'));
        }

        return this.convertWithToken(md);
      })
    );
  }

  private convertWithToken(md: string): Observable<string> {
    const body = {
      text: md,
      mode: 'markdown'
    };

    return this.http.post(this.apiUrl, body, {
      headers: { Authorization: `Bearer ${this.token}` },
      responseType: 'text'
    });
  }

  public processMermaidBlocks(html: string): string {
    const container = document.createElement('div');
    container.innerHTML = html;

    const mermaidBlocks = container.querySelectorAll(
      '.highlight-source-mermaid'
    );

    for (const block of mermaidBlocks) {
      const pre = block.querySelector('pre');

      if (!pre) {
        continue;
      }

      const mermaidCode = pre.textContent?.trim();

      if (!mermaidCode) {
        continue;
      }

      pre.innerHTML = '';

      const code = document.createElement('code');
      code.className = 'language-mermaid';
      code.textContent = mermaidCode;

      pre.appendChild(code);
    }

    return container.innerHTML;
  }
}