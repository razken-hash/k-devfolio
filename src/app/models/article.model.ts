export interface Article {
    id: string;
    title: string;
    description: string;
    date: string;
    file: string;
    author?: string;
    tags?: string[];
    coverImage?: string;
}