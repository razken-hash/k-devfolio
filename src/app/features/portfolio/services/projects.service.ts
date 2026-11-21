import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Category } from '../models/category.model';
import { PROJECT_CATEGORIES, PROJECTS } from '../../../data/projects.data';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  categories: Category[] = PROJECT_CATEGORIES;

  projects: Project[] = PROJECTS;
}
