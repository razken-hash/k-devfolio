import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExternalLink, faChevronLeft, faChevronRight, faXmark } from '@fortawesome/free-solid-svg-icons';

interface Technology {
  name: string;
  icon: string;
}

interface Project {
  id: number;
  name: string;
  category: 'fullstack' | 'backend' | 'frontend' | 'mobile';
  shortDescription: string;
  longDescription: string;
  images: string[];
  technologies: Technology[];
  githubUrl?: string;
  liveUrl?: string;
}

interface Category {
  id: string;
  label: string;
}

@Component({
  selector: 'app-projects',
  imports: [CommonModule, FontAwesomeModule],
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

  categories: Category[] = [
    { id: 'all', label: 'Tous les Projets' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'backend', label: 'Backend' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'mobile', label: 'Mobile' }
  ];

  projects: Project[] = [
    {
      id: 1,
      name: 'E-Commerce Platform',
      category: 'fullstack',
      shortDescription: 'Plateforme e-commerce complète avec panier et paiement',
      longDescription: 'Application e-commerce full-stack avec gestion des produits, panier d\'achats, système de paiement intégré et tableau de bord administrateur. Architecture microservices avec API REST et authentification JWT.',
      images: ["assets/images/projects/project.png"],
      technologies: [
        { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg' },
        { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' }
      ],
      githubUrl: 'https://github.com',
      liveUrl: 'https://example.com'
    },
    {
      id: 2,
      name: 'Task Management API',
      category: 'backend',
      shortDescription: 'API REST pour gestion de tâches avec authentification',
      longDescription: 'API RESTful robuste pour la gestion de tâches et projets. Inclut authentification JWT, gestion des rôles, filtrage avancé et pagination. Documentation Swagger complète.',
      images: ["assets/images/projects/project.png"],
      technologies: [
        { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
        { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' }
      ],
      githubUrl: 'https://github.com'
    },
    {
      id: 3,
      name: 'Portfolio Dashboard',
      category: 'frontend',
      shortDescription: 'Dashboard moderne avec graphiques interactifs',
      longDescription: 'Interface utilisateur moderne et responsive pour tableau de bord d\'analyse. Graphiques interactifs, animations fluides et design épuré.',
      images: ["assets/images/projects/project.png"],
      technologies: [
        { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg' },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { name: 'TailwindCSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' }
      ],
      liveUrl: 'https://example.com'
    },
    {
      id: 3,
      name: 'KDevfolio',
      category: 'frontend',
      shortDescription: 'Dashboard moderne avec graphiques interactifs',
      longDescription: 'Interface utilisateur moderne et responsive pour tableau de bord d\'analyse. Graphiques interactifs, animations fluides et design épuré.',
      images: ["assets/images/projects/kdevfolio/1.png", "assets/images/projects/kdevfolio/2.png", "assets/images/projects/kdevfolio/3.png"],
      technologies: [
        { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg' },
        { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
        { name: 'TailwindCSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' }
      ],
      liveUrl: 'https://k-devfolio-vercel.vercel.app/',
      githubUrl: 'https://github.com/razken-hash/k-devfolio.git'
    },
    {
      id: 4,
      name: 'Fitness Tracker App',
      category: 'mobile',
      shortDescription: 'Application mobile pour suivi fitness et nutrition',
      longDescription: 'Application mobile cross-platform pour le suivi des activités physiques, nutrition et objectifs de santé. Synchronisation cloud et statistiques détaillées.',
      images: ["assets/images/projects/project.png", "assets/images/projects/project.png"],
      technologies: [
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
        { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
        { name: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' }
      ],
      githubUrl: 'https://github.com'
    }
  ];

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