import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Education } from '../../models/education.model';
import { EducationService } from '../../services/education-service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-education',
  templateUrl: './education.html',
  imports: [CommonModule, TranslateModule],
})
export class EducationComponent {

  educations: Education[] = [];

  constructor(private educationService: EducationService) {
    this.educations = this.educationService.educations;
  }
}
