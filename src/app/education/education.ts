import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-education',
  templateUrl: './education.html',
  imports: [CommonModule],
  styles: [],
})
export class Education {
  educations: any[] = [
    {
      title: 'Master 2 Génie Logiciel',
      school: 'Université de Montpellier',
      logo: 'assets/images/um.png',
      website: 'https://www.umontpellier.fr/en/',
      date: '09/2024 – aujourd\'hui',
      location: 'Montpellier, France'
    },
    {
      title: 'Master Management Science Technologie (MTS)',
      school: 'Université de Montpellier, Institute of Business Administration (IAE)',
      logo: 'assets/images/iae.png',
      website: 'https://www.umontpellier.fr/en/universite/composantes/institut-dadministration-des-entreprises-iae',
      date: '09/2024 – aujourd\'hui',
      location: 'Montpellier, France'
    },
    {
      title: 'Ingénieur d\'État en Génie Logiciel',
      school: 'École Nationale Supérieure d\'Informatique ESI -ex INI',
      logo: 'assets/images/esi.png',
      website: 'https://www.esi.dz',
      date: '2020 – 2025',
      location: 'Alger, Algérie'
    }
  ];

  constructor() { }
}
