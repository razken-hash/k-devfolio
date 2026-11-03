
import { Component } from '@angular/core';
import { CvGenerator } from './cv-generator/cv-generator';

@Component({
  selector: 'app-jobs-apply',
  standalone: true,
  imports: [CvGenerator],
  template: `
    <app-cv-generator />
  `
})
export class JobsApply {}
