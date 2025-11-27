import { Injectable } from '@angular/core';
import { Education } from '../models/education.model';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  educations: Education[] = [
    {
      title: 'Master 2 Génie Logiciel',
      school: 'Université de Montpellier, Faculté des Sciences',
      logo: 'assets/images/um.png',
      website: 'https://www.umontpellier.fr/',
      startedAt: new Date('2024-09-01'),
      endedAt: null,
      location: 'Montpellier, France'
    },
    {
      title: 'Master Management Science Technologie (MTS)',
      school: 'Université de Montpellier, Institute of Business Administration (IAE)',
      logo: 'assets/images/iae.png',
      website:
        'https://www.umontpellier.fr/universite/composantes/institut-dadministration-des-entreprises-iae',
      startedAt: new Date('2024-09-01'),
      endedAt: null,
      location: 'Montpellier, France'
    },
    {
      title: 'Ingénieur d\'État en Génie Logiciel',
      school: 'École Nationale Supérieure d\'Informatique ESI -ex INI',
      logo: 'assets/images/esi.png',
      website: 'https://www.esi.dz',
      startedAt: new Date('2020-12-10'),
      endedAt: new Date('2025-07-01'),
      location: 'Alger, Algérie'
    }
  ];
}
