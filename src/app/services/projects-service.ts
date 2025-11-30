import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {

  categories: Category[] = [
    { id: 'all', label: 'Tous les Projets' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'backend', label: 'Backend' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'mobile', label: 'Mobile' }
  ];

  projects: Project[] = [
    {
      id: "smell-bert",
      name: 'SmellBERT',
      category: 'fullstack',
      shortDescription: 'Plateforme web intégrant CodeBERT pour la détection automatique des code smells.',
      longDescription: `Plateforme web développée avec Angular, Spring Boot et Python permettant l’entraînement et 
      l’intégration d’un modèle CodeBERT préentraîné. L’application analyse des projets Java complets, 
      détecte automatiquement les code smells et génère des rapports PDF détaillés via des endpoints REST.`,
      images: ['assets/images/projects/smellbert/1.png', 'assets/images/projects/smellbert/2.png', 'assets/images/projects/smellbert/3.png', 'assets/images/projects/smellbert/4.png', 'assets/images/projects/smellbert/5.png', 'assets/images/projects/smellbert/6.png'],
      technologies: [
        { name: 'Angular', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg' },
        { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      ]
    },

    {
      id: "soft-scanner",
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
      id: "pommy",
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
      id: "mpay",
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
      id: "yalidine-queue",
      name: 'Yalidine Queue',
      category: 'mobile',
      shortDescription: 'Application Flutter pour la gestion des files d’attente Yalidine.',
      longDescription: `Développée en Flutter, l’application gère les files d’attente, s’intègre à une API REST et assure 
      l’impression sur imprimantes thermiques. Déployée sur tablettes Android et Android TV.`,
      images: ['assets/images/projects/yalidinequeue/1.png', 'assets/images/projects/yalidinequeue/2.png', 'assets/images/projects/yalidinequeue/3.png', 'assets/images/projects/yalidinequeue/4.png', 'assets/images/projects/yalidinequeue/5.png'],
      technologies: [
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
        { name: 'RESTful API', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg' },
      ]
    },

    {
      id: "click-order",
      name: 'ClickOrder',
      category: 'mobile',
      shortDescription: 'Application Flutter de commande de thé/café en entreprise.',
      longDescription: `Développée en Flutter avec authentification, paiement en ligne, messagerie via WebSockets 
      et notifications push Firebase.`,
      images: ['assets/images/projects/teaboy/1.png'],
      technologies: [
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
        { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg' },
        { name: 'WebSockets', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg' }
      ]
    },

    {
      id: "parkir",
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
      id: "auto-school",
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
      id: "hotelency",
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
      id: "tera-app",
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
      id: "kdevfolio",
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
}
