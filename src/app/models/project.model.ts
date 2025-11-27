import { Technology } from "./technology.model";

export interface Project {
    id: number;
    name: string;
    category: 'fullstack' | 'backend' | 'frontend' | 'mobile';
    shortDescription: string;
    longDescription: string;
    images: string[];
    technologies: Technology[];
    githubUrl?: string;
    liveUrl?: string;
}