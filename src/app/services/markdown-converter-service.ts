import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarkdownConverterService {

  private apiUrl = 'https://api.github.com/markdown';

  constructor(private http: HttpClient) { }

  convertMarkdownToHtml(md: string): Observable<string> {
    const body = {
      text: md,
      mode: 'markdown'
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, body, {
      headers,
      responseType: 'text'
    });
  }
}
