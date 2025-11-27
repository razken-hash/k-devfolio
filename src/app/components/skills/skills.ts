import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SkillsService } from '../../services/skills-service';
import { SkillCategory } from '../../models/skills-category.model';


@Component({
  selector: 'app-skills',
  templateUrl: './skills.html',
  imports: [CommonModule]
})
export class Skills {
  activeCategory: SkillCategory;

  skillsCategories: SkillCategory[];

  constructor(private skillsService: SkillsService) {
    this.skillsCategories = this.skillsService.skillsData;
    this.activeCategory = this.skillsCategories[0];
  }

  get totalSkills(): number {
    return this.skillsCategories.reduce((total, category) => total + category.skills.length, 0);
  }

  setActiveCategory(category: SkillCategory): void {
    this.activeCategory = category;
  }
}