import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Experience } from '../models/experience.model';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  constructor(private translateService: TranslateService) { }

  getExperiences(): Observable<Experience[]> {
    return this.translateService
      .stream(['EXPERIENCE', 'PLACES'])
      .pipe(
        map((translations: any) => {
          const EXPERIENCE = translations.EXPERIENCE;
          const PLACES = translations.PLACES;
          const HIGHLIGHTS = EXPERIENCE.HIGHLIGHTS ?? {};

          return [
            {
              company: 'Rakuten France',
              role: EXPERIENCE.FULL_STACK_DEV,
              logo: 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/rakuten-badge/default.svg',
              website: 'https://fr.shopping.rakuten.com/',
              startedAt: new Date('2026-03-01'),
              endedAt: new Date('2026-09-30'),
              location: `${PLACES.PARIS}, ${PLACES.FRANCE}`,
              highlights: HIGHLIGHTS.RAKUTEN ?? [],
              technologies: ['React', 'Next.js', 'TypeScript', 'MUI', 'Spring Boot', 'AWS S3', 'GitHub Actions', 'Playwright', 'Reg-Suit'],
            },
            {
              company: 'LIRMM',
              role: EXPERIENCE.FULL_STACK_DEV,
              logo: 'assets/images/lirmm.jpeg',
              website: 'https://www.lirmm.fr/',
              startedAt: new Date('2025-01-01'),
              endedAt: new Date('2025-07-31'),
              location: `${PLACES.MONTPELLIER}, ${PLACES.FRANCE}`,
              highlights: HIGHLIGHTS.LIRMM ?? [],
              technologies: ['React', 'Node.js', 'Express', 'TypeScript', 'Playwright', 'Selenium', 'Python', 'LLMs'],
            },
            {
              company: 'LCSI',
              role: EXPERIENCE.RD_ENGINEER,
              logo: 'assets/images/lcsi.png',
              startedAt: new Date('2024-09-01'),
              endedAt: new Date('2025-07-31'),
              highlights: HIGHLIGHTS.LCSI ?? [],
              technologies: ['Python', 'Django', 'React', 'SonarQube', 'LLMs', 'Transformers', 'PyTorch', 'CodeBERT'],
              publication: {
                label: `${EXPERIENCE.PUBLISHED_ARTICLE} · MDPI Applied Sciences 16(14):7040`,
                url: 'https://www.mdpi.com/2076-3417/16/14/7040',
              },
            },
            {
              company: 'Ourquilane',
              role: EXPERIENCE.FULL_STACK_DEV,
              logo: 'assets/images/ourquilane.png',
              startedAt: new Date('2022-10-01'),
              endedAt: new Date('2024-09-30'),
              highlights: HIGHLIGHTS.OURQUILANE ?? [],
              technologies: ['Java', 'Spring Boot', 'React', 'REST API', 'WebSockets', 'PostgreSQL', 'React Native'],
            },
          ];
        })
      );
  }
}
