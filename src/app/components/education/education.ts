import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Education } from '../../models/education.model';
import { EducationService } from '../../services/education-service';

@Component({
  selector: 'app-education',
  templateUrl: './education.html',
  imports: [CommonModule],
})
export class EducationComponent {

  educations: Education[] = [];

  constructor(private educationService: EducationService) {
    this.educations = this.educationService.educations;
  }
}
