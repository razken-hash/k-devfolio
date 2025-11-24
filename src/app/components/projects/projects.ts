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
      name: 'SmellBERT',
      category: 'fullstack',
      shortDescription: 'Plateforme web intégrant CodeBERT pour la détection automatique des code smells.',
      longDescription: `Plateforme web développée avec Angular, Spring Boot et Python permettant l’entraînement et 
    l’intégration d’un modèle CodeBERT préentraîné. L’application analyse des projets Java complets, 
    détecte automatiquement les code smells et génère des rapports PDF détaillés via des endpoints REST.`,
      images: ['assets/images/projects/smellbert/1.png', 'assets/images/projects/smellbert/2.png', 'assets/images/projects/smellbert/3.png'],
      technologies: [
        { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg' },
        { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      ]
    },

    {
      id: 2,
      name: 'SoftScanner',
      category: 'fullstack',
      shortDescription: 'Analyseur statique et dynamique des projets Angular et React.',
      longDescription: `Application MEAN permettant l’analyse des projets Angular/React. Génération automatique 
    des graphes de navigation, extraction de la structure du projet, et scénarios de test avec Selenium et Puppeteer.`,
      images: ['assets/images/projects/softscanner/3.png', 'assets/images/projects/softscanner/1.png', 'assets/images/projects/softscanner/2.png', 'assets/images/projects/softscanner/4.png'],
      technologies: [
        { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg' },
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'Selenium', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg' },
        { name: 'Puppeteer', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/puppeteer/puppeteer-original.svg' }
      ]
    },
    {
      id: 3,
      name: 'Pommy',
      category: 'mobile',
      shortDescription: 'Solution web et mobile pour la gestion centralisée des comptes bancaires.',
      longDescription: `Solution sécurisée avec Spring Boot, Angular et Flutter pour la centralisation de comptes bancaires 
    et la réalisation de transactions via l’API SATIM. Sécurité avancée : JWT, OTP, empreinte, chiffrement, rate limiting.`,
      images: ['assets/images/projects/pommy/1.svg', 'assets/images/projects/pommy/2.svg', 'assets/images/projects/pommy/3.svg', 'assets/images/projects/pommy/4.svg', 'assets/images/projects/pommy/5.svg', 'assets/images/projects/pommy/6.svg', 'assets/images/projects/pommy/7.svg', 'assets/images/projects/pommy/8.svg', 'assets/images/projects/pommy/9.svg', 'assets/images/projects/pommy/10.svg', 'assets/images/projects/pommy/11.svg', 'assets/images/projects/pommy/12.svg', 'assets/images/projects/pommy/13.svg'],
      technologies: [
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
        { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg' },
      ]
    },
    {
      id: 4,
      name: 'MPay',
      category: 'fullstack',
      shortDescription: 'Solution web et mobile pour la gestion centralisée des comptes bancaires.',
      longDescription: `Solution sécurisée avec Spring Boot, Angular et Flutter pour la centralisation de comptes bancaires 
    et la réalisation de transactions via l’API SATIM. Sécurité avancée : JWT, OTP, empreinte, chiffrement, rate limiting.`,
      images: ['assets/images/projects/project.png'],
      technologies: [
        { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
        { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg' },
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' }
      ]
    },

    {
      id: 5,
      name: 'Yalidine Queue',
      category: 'mobile',
      shortDescription: 'Application Flutter pour la gestion des files d’attente Yalidine.',
      longDescription: `Développée en Flutter, l’application gère les files d’attente, s’intègre à une API REST et assure 
    l’impression sur imprimantes thermiques. Déployée sur tablettes Android et Android TV.`,
      images: ['assets/images/projects/project.png'],
      technologies: [
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
        { name: 'RESTful API', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg' },
      ]
    },

    {
      id: 6,
      name: 'TeaBoy',
      category: 'mobile',
      shortDescription: 'Application Flutter de commande de thé/café en entreprise.',
      longDescription: `Développée en Flutter avec authentification, paiement en ligne, messagerie via WebSockets 
    et notifications push Firebase.`,
      images: ['assets/images/projects/project.png'],
      technologies: [
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
        { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg' },
        { name: 'WebSockets', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg' }
      ]
    },

    {
      id: 7,
      name: 'Parkir',
      category: 'fullstack',
      shortDescription: 'App mobile Kotlin + backend Spring Boot pour réservation de parkings.',
      longDescription: `Application permettant la réservation de parkings, l’intégration Google Maps, paiement en ligne,
    notifications push et validation via QR Code hors ligne.`,
      images: ['assets/images/projects/parkir/1.png', 'assets/images/projects/parkir/2.png', 'assets/images/projects/parkir/3.png', 'assets/images/projects/parkir/4.png', 'assets/images/projects/parkir/5.png', 'assets/images/projects/parkir/6.png', 'assets/images/projects/parkir/7.png'],
      technologies: [
        { name: 'Jetpack Compose', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jetpackcompose/jetpackcompose-original.svg' },
        { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
        { name: 'Google Maps API', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' },
        { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg' },
      ]
    },

    {
      id: 8,
      name: 'AutoSchool',
      category: 'frontend',
      shortDescription: 'Application Flutter Desktop pour la gestion des auto-écoles.',
      longDescription: `Développée avec Flutter Desktop. Intégration Firebase pour la gestion de données, 
    notifications push et génération de rapports PDF.`,
      images: ['assets/images/projects/autoschool/1.png', 'assets/images/projects/autoschool/2.png', 'assets/images/projects/autoschool/3.png'],
      technologies: [
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
        { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg' }
      ]
    },

    {
      id: 9,
      name: 'Hotelency',
      category: 'backend',
      shortDescription: 'Projet microservices pour hôtels, agences et clients.',
      longDescription: `Projet académique en Spring Boot basé sur micro-services avec implémentations en RMI, SOAP, REST,
    gRPC et GraphQL. Gestion des données via Spring Data JPA.`,
      images: ['assets/images/projects/hotelency/1.png'],

      technologies: [
        { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
        { name: 'RESTful API', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg' },
        { name: 'gRPC', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grpc/grpc-original.svg' },
        { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' }
      ]
    },

    {
      id: 10,
      name: 'TeraApp',
      category: 'fullstack',
      shortDescription: 'Clone Google Docs avec édition collaborative temps réel.',
      longDescription: `Développée en MEAN stack. Authentification SSO, REST + WebSocket, synchronisation temps réel 
    et implémentation CRDT pour résolution de conflits.`,
      images: ['assets/images/projects/project.png'],
      technologies: [
        { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg' },
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'WebSocket', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg' }
      ]
    },
    {
      id: 11,
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