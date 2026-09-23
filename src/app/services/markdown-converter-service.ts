import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class MarkdownConverterService {

  private apiUrl = 'https://api.github.com/markdown';
  private token = "";

  constructor(private http: HttpClient) { }

  convertMarkdownToHtml(md: string): Observable<string> {
    const body = {
      text: md,
      mode: 'markdown'
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}` // Use the token from environment
    });

    return this.http.post(this.apiUrl, body, {
      headers,
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

      // Remove GitHub's syntax highlighting
      pre.innerHTML = '';

      // Create clean <code>
      const code = document.createElement('code');

      code.className = 'language-mermaid';

      code.textContent = mermaidCode;

      pre.appendChild(code);
    }

    return container.innerHTML;
  }
}

