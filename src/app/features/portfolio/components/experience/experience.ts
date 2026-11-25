import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ExperienceService } from '../../services/experience.service';
import { Experience } from '../../models/experience.model';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AsyncPipe, DatePipe, UpperCasePipe, TranslateModule],
})
export class ExperienceComponent {
  experiences: Observable<Experience[]>;

  constructor(private experienceService: ExperienceService) {
    this.experiences = this.experienceService.getExperiences();
  }
}
