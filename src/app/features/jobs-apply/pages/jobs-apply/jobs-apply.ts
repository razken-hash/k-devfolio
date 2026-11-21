
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CvGenerator } from '../../components/cv-generator/cv-generator';

@Component({
  selector: 'app-jobs-apply',
  standalone: true,
  imports: [CvGenerator],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <app-cv-generator />
  `
})
export class JobsApply {}
