import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EducationService } from '../../services/education-service';
import { Education } from '../../models/education.model';

@Component({
  selector: 'app-education',
  templateUrl: './education.html',
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class EducationComponent {
  educations: Observable<Education[]>;

  constructor(private educationService: EducationService) {
    this.educations = this.educationService.getEducations();
  }
}