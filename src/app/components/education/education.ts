import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EducationService } from '../../services/education-service';
import { Education } from '../../models/education.model';

@Component({
  selector: 'app-education',
  templateUrl: './education.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AsyncPipe, DatePipe, UpperCasePipe, TranslateModule],
})
export class EducationComponent {
  educations: Observable<Education[]>;

  constructor(private educationService: EducationService) {
    this.educations = this.educationService.getEducations();
  }
}