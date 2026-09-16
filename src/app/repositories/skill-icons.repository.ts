import { Skill } from "../models/skill.model";
import { Technology } from "../models/technology.model";

export class SkillIconsRepository {
  private static readonly CDN =
    "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons";

  // ---------------------------------------------------------------------------
  // Technologies
  // ---------------------------------------------------------------------------

  static readonly ANGULAR: Technology = {
    name: "Angular",
    description:
      "TypeScript framework for building scalable, component-based web applications with powerful tooling and reactive capabilities.",
    icon: `${this.CDN}/angular/default.svg`,
  };

  static readonly APACHE_KAFKA: Technology = {
    name: "Apache Kafka",
    description:
      "Distributed event streaming platform designed for high-throughput, fault-tolerant messaging and real-time data processing.",
    icon: `${this.CDN}/apache-kafka/default.svg`,
  };

  static readonly APACHE_MAVEN: Technology = {
    name: "Apache Maven",
    description:
      "Build automation and dependency management tool widely used for Java application development and project lifecycle management.",
    icon: `${this.CDN}/apache-maven/default.svg`,
  };

  static readonly AWS: Technology = {
    name: "AWS",
    description:
      "Cloud platform providing scalable infrastructure, storage, networking, databases, security, and application deployment services.",
    icon: `${this.CDN}/aws/default.svg`,
  };

  static readonly BASH: Technology = {
    name: "Bash",
    description:
      "Unix shell and scripting language used for automation, system administration, development workflows, and command-line operations.",
    icon: `${this.CDN}/bash/default.svg`,
  };

  static readonly CHAKRA_UI: Technology = {
    name: "Chakra UI",
    description:
      "Accessible React component library providing composable building blocks for creating modern and responsive interfaces.",
    icon: `${this.CDN}/chakra-ui/default.svg`,
  };

  static readonly CSS3: Technology = {
    name: "CSS3",
    description:
      "Styling language used to create responsive layouts, visual designs, animations, and polished web interfaces.",
    icon: `${this.CDN}/css3/default.svg`,
  };

  static readonly CYPRESS: Technology = {
    name: "Cypress",
    description:
      "End-to-end testing framework designed for reliable browser-based application testing with fast feedback during development.",
    icon: `${this.CDN}/cypress/default.svg`,
  };

  static readonly DOCKER: Technology = {
    name: "Docker",
    description:
      "Containerization platform used to package applications and dependencies into portable, reproducible runtime environments.",
    icon: `${this.CDN}/docker/default.svg`,
  };

  static readonly FIGMA: Technology = {
    name: "Figma",
    description:
      "Collaborative design platform used for creating interfaces, prototypes, design systems, and visual specifications.",
    icon: `${this.CDN}/figma/default.svg`,
  };

  static readonly FIREBASE: Technology = {
    name: "Firebase",
    description:
      "Google platform providing authentication, databases, hosting, storage, analytics, and backend services for applications.",
    icon: `${this.CDN}/firebase/default.svg`,
  };

  static readonly FLUTTER: Technology = {
    name: "Flutter",
    description:
      "UI toolkit for building natively compiled applications across mobile, web, desktop, and embedded platforms.",
    icon: `${this.CDN}/flutter/default.svg`,
  };

  static readonly GIT: Technology = {
    name: "Git",
    description:
      "Distributed version control system used to track changes, collaborate on code, and manage software development history.",
    icon: `${this.CDN}/git/default.svg`,
  };

  static readonly GITHUB: Technology = {
    name: "GitHub",
    description:
      "Development platform for hosting repositories, collaborating on code, managing issues, and automating software workflows.",
    icon: `${this.CDN}/github/default.svg`,
  };

  static readonly GITHUB_ACTIONS: Technology = {
    name: "GitHub Actions",
    description:
      "CI/CD automation platform used to build, test, deploy, and automate workflows directly within GitHub repositories.",
    icon: `${this.CDN}/github-actions/default.svg`,
  };

  static readonly GITLAB: Technology = {
    name: "GitLab",
    description:
      "DevOps platform combining source control, collaboration, CI/CD, security, and project management capabilities.",
    icon: `${this.CDN}/gitlab/default.svg`,
  };

  static readonly GOOGLE_MAPS: Technology = {
    name: "Google Maps",
    description:
      "Mapping platform providing location services, interactive maps, geocoding, directions, and place information.",
    icon: `${this.CDN}/google-maps/default.svg`,
  };

  static readonly GRAFANA: Technology = {
    name: "Grafana",
    description:
      "Observability platform used to visualize metrics, monitor systems, and build interactive operational dashboards.",
    icon: `${this.CDN}/grafana/default.svg`,
  };

  static readonly GRAPHQL: Technology = {
    name: "GraphQL",
    description:
      "API query language allowing clients to request precisely the data they need through a strongly typed schema.",
    icon: `${this.CDN}/graphql/default.svg`,
  };

  static readonly GRPC: Technology = {
    name: "gRPC",
    description:
      "High-performance remote procedure call framework designed for efficient communication between distributed services.",
    icon: `${this.CDN}/grpc/default.svg`,
  };

  static readonly HIBERNATE: Technology = {
    name: "Hibernate",
    description:
      "Java object-relational mapping framework simplifying database persistence and interaction through domain-oriented entities.",
    icon: `${this.CDN}/hibernate/default.svg`,
  };

  static readonly HTML5: Technology = {
    name: "HTML5",
    description:
      "Markup language providing the semantic structure and foundational elements required for modern web applications.",
    icon: `${this.CDN}/html5/default.svg`,
  };

  static readonly JAVA: Technology = {
    name: "Java",
    description:
      "Object-oriented programming language widely used for enterprise applications, backend systems, and distributed software.",
    icon: `${this.CDN}/java/default.svg`,
  };

  static readonly JAVASCRIPT: Technology = {
    name: "JavaScript",
    description:
      "Dynamic programming language powering interactive web applications across browsers, servers, and modern development environments.",
    icon: `${this.CDN}/javascript/default.svg`,
  };

  static readonly JETPACK_COMPOSE: Technology = {
    name: "Jetpack Compose",
    description:
      "Modern Android UI toolkit for building native interfaces using a declarative Kotlin-based development approach.",
    icon: `${this.CDN}/jetpack-compose/default.svg`,
  };

  static readonly JWT: Technology = {
    name: "JWT",
    description:
      "Compact token standard commonly used for securely transmitting authentication and authorization information between services.",
    icon: `${this.CDN}/jwt/default.svg`,
  };

  static readonly KIBANA: Technology = {
    name: "Kibana",
    description:
      "Visualization and analytics interface for exploring logs, metrics, and data stored within Elasticsearch.",
    icon: `${this.CDN}/kibana/default.svg`,
  };

  static readonly KUBERNETES: Technology = {
    name: "Kubernetes",
    description:
      "Container orchestration platform automating deployment, scaling, networking, and management of containerized applications.",
    icon: `${this.CDN}/kubernetes/default.svg`,
  };

  static readonly LINUX: Technology = {
    name: "Linux",
    description:
      "Open-source operating system widely used for servers, development environments, cloud infrastructure, and containers.",
    icon: `${this.CDN}/linux/default.svg`,
  };

  static readonly MATERIAL_UI: Technology = {
    name: "Material UI",
    description:
      "React component library implementing Material Design principles for building consistent and responsive interfaces.",
    icon: `${this.CDN}/material-ui/default.svg`,
  };

  static readonly MONGODB: Technology = {
    name: "MongoDB",
    description:
      "Document-oriented NoSQL database designed for flexible data models, scalability, and high-performance applications.",
    icon: `${this.CDN}/mongodb/default.svg`,
  };

  static readonly MYSQL: Technology = {
    name: "MySQL",
    description:
      "Relational database management system widely used for transactional applications and structured data storage.",
    icon: `${this.CDN}/mysql/default.svg`,
  };

  static readonly NEXT_JS: Technology = {
    name: "Next.js",
    description:
      "React framework supporting server rendering, static generation, routing, and full-stack web application development.",
    icon: `${this.CDN}/nextjs/default.svg`,
  };

  static readonly NGINX: Technology = {
    name: "Nginx",
    description:
      "High-performance web server and reverse proxy commonly used for routing, caching, load balancing, and serving applications.",
    icon: `${this.CDN}/nginx/default.svg`,
  };

  static readonly NGRX: Technology = {
    name: "NgRx",
    description:
      "Reactive state management library for Angular applications based on predictable centralized application state.",
    icon: `${this.CDN}/ngrx/default.svg`,
  };

  static readonly NODE_JS: Technology = {
    name: "Node.js",
    description:
      "JavaScript runtime built on Chrome's V8 engine for developing scalable server-side and backend applications.",
    icon: `${this.CDN}/nodejs/default.svg`,
  };

  static readonly NOTION: Technology = {
    name: "Notion",
    description:
      "Workspace platform used for organizing documentation, project information, notes, and collaborative knowledge.",
    icon: `${this.CDN}/notion/default.svg`,
  };

  static readonly PLAYWRIGHT: Technology = {
    name: "Playwright",
    description:
      "Browser automation framework supporting reliable end-to-end testing across Chromium, Firefox, and WebKit.",
    icon: `${this.CDN}/playwright/default.svg`,
  };

  static readonly POSTGRESQL: Technology = {
    name: "PostgreSQL",
    description:
      "Advanced open-source relational database known for reliability, extensibility, and strong SQL capabilities.",
    icon: `${this.CDN}/postgresql/default.svg`,
  };

  static readonly POSTMAN: Technology = {
    name: "Postman",
    description:
      "API development platform used to design, test, document, and automate HTTP API workflows.",
    icon: `${this.CDN}/postman/default.svg`,
  };

  static readonly PROMETHEUS: Technology = {
    name: "Prometheus",
    description:
      "Open-source monitoring system collecting time-series metrics for infrastructure and application observability.",
    icon: `${this.CDN}/prometheus/default.svg`,
  };

  static readonly PUPPETEER: Technology = {
    name: "Puppeteer",
    description:
      "Node.js library providing browser automation capabilities for testing, scraping, and automated web interactions.",
    icon: `${this.CDN}/puppeteer/default.svg`,
  };

  static readonly PYTHON: Technology = {
    name: "Python",
    description:
      "Versatile programming language widely used for backend development, automation, data science, and artificial intelligence.",
    icon: `${this.CDN}/python/default.svg`,
  };

  static readonly REACT: Technology = {
    name: "React",
    description:
      "JavaScript library for building reusable user interfaces through declarative and component-based development.",
    icon: `${this.CDN}/react/light.svg`,
  };

  static readonly REDIS: Technology = {
    name: "Redis",
    description:
      "In-memory data store commonly used for caching, sessions, queues, and high-speed application data access.",
    icon: `${this.CDN}/redis/default.svg`,
  };

  static readonly SELENIUM: Technology = {
    name: "Selenium",
    description:
      "Browser automation framework used for testing web applications across multiple browsers and operating systems.",
    icon: `${this.CDN}/selenium/default.svg`,
  };

  static readonly SPRING_BOOT: Technology = {
    name: "Spring Boot",
    description:
      "Java framework simplifying production-ready application development through auto-configuration and convention-based setup.",
    icon: `${this.CDN}/spring-boot/default.svg`,
  };

  static readonly SPRING_DATA_JPA: Technology = {
    name: "Spring Data JPA",
    description:
      "Spring framework module simplifying repository-based persistence and database access using JPA.",
    icon: `${this.CDN}/spring/default.svg`,
  };

  static readonly SPRING_SECURITY: Technology = {
    name: "Spring Security",
    description:
      "Security framework providing authentication, authorization, and protection mechanisms for Spring applications.",
    icon: `${this.CDN}/spring-security/default.svg`,
  };

  static readonly SUPABASE: Technology = {
    name: "Supabase",
    description:
      "Backend platform providing PostgreSQL, authentication, storage, realtime capabilities, and APIs for modern applications.",
    icon: `${this.CDN}/supabase/default.svg`,
  };

  static readonly TAILWIND_CSS: Technology = {
    name: "Tailwind CSS",
    description:
      "Utility-first CSS framework enabling rapid development of responsive and customizable user interfaces.",
    icon: `${this.CDN}/tailwindcss/default.svg`,
  };

  static readonly TYPESCRIPT: Technology = {
    name: "TypeScript",
    description:
      "Statically typed superset of JavaScript providing improved tooling, maintainability, and type safety.",
    icon: `${this.CDN}/typescript/default.svg`,
  };

  static readonly WEBSOCKET: Technology = {
    name: "WebSocket",
    description:
      "Communication protocol enabling persistent, bidirectional real-time connections between clients and servers.",
    icon: `${this.CDN}/socket-io/default.svg`,
  };

  // ---------------------------------------------------------------------------
  // Skills
  // ---------------------------------------------------------------------------

  static readonly AI_ASSISTED_DEVELOPMENT: Skill = {
    name: "AI-Assisted Development",
    description:
      "Development approach using artificial intelligence tools to improve productivity, code quality, and engineering workflows.",
    icon: `${this.CDN}/claude-code/default.svg`,
  };

  static readonly ALGORITHMS_AND_DATA_STRUCTURES: Skill = {
    name: "Algorithms and Data Structures",
    description:
      "Foundational computer science concepts used to design efficient solutions and optimize computational performance.",
    icon: `${this.CDN}/aws-aws-infrastructure-composer/default.svg`,
  };

  static readonly DESIGN_PATTERNS: Skill = {
    name: "Design Patterns",
    description:
      "Reusable software design solutions that address recurring architectural and object-oriented programming problems.",
    icon: `${this.CDN}/aws-group-aws-account/default.svg`,
  };

  static readonly MICROSERVICES: Skill = {
    name: "Microservices",
    description:
      "Architectural approach decomposing applications into independently deployable services with focused business responsibilities.",
    icon: `${this.CDN}/k8s-service/default.svg`,
  };

  static readonly MICROFRONTEND_ARCHITECTURE: Skill = {
    name: "Microfrontend Architecture",
    description:
      "Frontend architecture dividing large applications into independently developed, deployed, and maintained user interface modules.",
    icon: `${this.CDN}/webpack/default.svg`,
  };

  static readonly REST_API: Skill = {
    name: "REST API",
    description:
      "Architectural style for designing stateless web APIs using standard HTTP methods and resource-oriented communication.",
    icon: `${this.CDN}/swagger/default.svg`,
  };

  static readonly SOFTWARE_ARCHITECTURE: Skill = {
    name: "Software Architecture",
    description:
      "Discipline focused on structuring software systems for maintainability, scalability, reliability, and long-term evolution.",
    icon: `${this.CDN}/k8s-service/default.svg`,
  };
}