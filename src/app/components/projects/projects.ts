import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExternalLink, faChevronLeft, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Project } from '../../models/project.model';
import { Category } from '../../models/category.model';
import { ProjectsService } from '../../services/projects-service';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  templateUrl: './projects.html',
  styles: ``
})
export class Projects {
  faGithub = faGithub;
  faExternalLink = faExternalLink;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faXmark = faXmark;

  activeTab: string = 'all';
  selectedProject: Project | null = null;
  currentImageIndex: number = 0;
  categories: Category[] = [];
  projects: Project[] = [];

  constructor(private projectsService: ProjectsService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.categories = this.projectsService.categories;
    this.projects = this.projectsService.projects;

    // Listen to query parameters
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['project']) {
        const projectId = params['project'];
        const project = this.filteredProjects.find(p => p.id === projectId);
        if (project) {
          this.openProject(project);
        }
      }
    });
  }

  get filteredProjects(): Project[] {
    return this.activeTab === 'all'
      ? this.projects
      : this.projects.filter(p => p.category === this.activeTab);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  openProject(project: Project): void {
    this.selectedProject = project;
    this.currentImageIndex = 0;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  closeProject(): void {
    this.selectedProject = null;
    this.currentImageIndex = 0;
    document.body.style.overflow = 'auto';
  }

  nextImage(): void {
    if (this.selectedProject) {
      this.currentImageIndex =
        this.currentImageIndex === this.selectedProject.images.length - 1
          ? 0
          : this.currentImageIndex + 1;
    }
  }

  prevImage(): void {
    if (this.selectedProject) {
      this.currentImageIndex =
        this.currentImageIndex === 0
          ? this.selectedProject.images.length - 1
          : this.currentImageIndex - 1;
    }
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  getProjectImagePath(projectName: string, imageName: string): string {
    // return `assets/images/projects/${projectName.toLowerCase().replace(/\s+/g, '-')}/${imageName}`;
    return imageName;
  }
}