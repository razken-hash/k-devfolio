export type ArticleLanguage = 'EN' | 'ES' | 'FR' | 'TR';

export interface ArticleBase {
  id: string;
  slug: string;
  title: string;
  description: string;
  language: ArticleLanguage;
  readingTimeMinutes: number;
  authorName: string;
  categories: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Article extends ArticleBase {}

export interface FullArticle extends ArticleBase {
  content: string;
}