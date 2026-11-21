import { Injectable } from '@angular/core';
import { SkillCategory } from '../models/skills-category.model';
import { SKILL_CATEGORIES } from '../../../data/skills.data';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  skillsData: SkillCategory[] = SKILL_CATEGORIES;
}
