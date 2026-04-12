import { Injectable } from '@angular/core';
import { Education } from '../models/education.model';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  constructor(private translateService: TranslateService) { }

  getEducations(): Observable<Education[]> {
    return this.translateService
      .stream(['EDUCATION', 'PLACES'])
      .pipe(
        map((translations: any) => {
          const EDUCATION = translations.EDUCATION;
          const PLACES = translations.PLACES;

          return [
            {
              title: EDUCATION.MASTER_GL,
              school: EDUCATION.UM_FDS,
              logo: 'assets/images/um.png',
              website: 'https://www.umontpellier.fr/',
              startedAt: new Date('2024-09-01'),
              endedAt: null,
              location: `${PLACES.MONTPELLIER}, ${PLACES.FRANCE}`,
            },
            {
              title: EDUCATION.MASTER_MTS,
              school: EDUCATION.UM_IAE,
              logo: 'assets/images/iae.png',
              website:
                'https://www.umontpellier.fr/universite/composantes/institut-dadministration-des-entreprises-iae',
              startedAt: new Date('2024-09-01'),
              endedAt: null,
              location: `${PLACES.MONTPELLIER}, ${PLACES.FRANCE}`,
            },
            {
              title: EDUCATION.ENGINEER_GL,
              school: EDUCATION.ESI,
              logo: 'assets/images/esi.png',
              website: 'https://www.esi.dz',
              startedAt: new Date('2020-12-10'),
              endedAt: new Date('2025-07-01'),
              location: `${PLACES.ALGER}, ${PLACES.ALGERIA}`,
            },
          ];
        })
      );
  }
}