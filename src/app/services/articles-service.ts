import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Article } from '../models/article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private articles: Article[] = [
    {
      id: 'docker-base-images-explained-part-1',
      title: 'Docker Base Images Explained: A Comprehensive Guide — Part I',
      description: 'Explore Docker base images, from Full and Slim to Alpine, and learn how to balance image size, compatibility, security, and developer convenience when choosing the right base image for your applications.',
      date: '2026-10-06',
      file: 'assets/articles/docker-base-images-explained-part-1/docker-base-images-explained-part-1',
      author: 'KENNICHE ABDERRAZAK',
      tags: ['Docker', 'Linux', 'DevOps'],
      coverImage: 'assets/articles/docker-base-images-explained-part-1/images/docker-base-images-explained-part-1',
      readingTime: 11,
    },
  ];

  constructor(private http: HttpClient) { }

  getAllArticles(): Observable<Article[]> {
    // Option 1: Return hardcoded data
    return of(this.articles);

    // Option 2: Fetch from JSON file
    // return this.http.get<ArticleMetadata>('assets/articles/metadata.json')
    //   .pipe(map(data => data.articles));
  }

  getArticleById(id: string): Observable<Article | undefined> {
    return this.getAllArticles().pipe(
      map(articles => articles.find(article => article.id === id))
    );
  }

  getArticleContent(filename: string): Observable<string> {
    return this.http.get(filename, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Error loading article:', error);
          return of('# Article not found\n\nThe requested article could not be loaded.');
        })
      );
  }

  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  getArticlesByTag(tag: string): Observable<Article[]> {
    return this.getAllArticles().pipe(
      map(articles => articles.filter(article =>
        article.tags?.includes(tag)
      ))
    );
  }

  getRecentArticles(limit: number = 3): Observable<Article[]> {
    return this.getAllArticles().pipe(
      map(articles => articles.slice(0, limit))
    );
  }
}