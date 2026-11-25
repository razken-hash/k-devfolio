import { Technology } from '../../../shared/models/technology.model';

export interface Experience {
    company: string;
    role: string;
    /** Logo URL. Leave empty to show the company's initial instead. */
    logo: string;
    website?: string;
    startedAt: Date;
    endedAt: Date | null;
    location?: string;
    highlights: string[];
    technologies: Technology[];
    publication?: {
        label: string;
        url: string;
    };
}
