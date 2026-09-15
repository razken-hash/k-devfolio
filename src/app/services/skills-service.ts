import { Injectable } from "@angular/core";
import { SkillCategory } from "../models/skills-category.model";

@Injectable({
  providedIn: "root",
})
export class SkillsService {
  private readonly cdn = "https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons";

  skillsData: SkillCategory[] = [
    // -------------------------------------------------------------------------
    // Backend
    // -------------------------------------------------------------------------
    {
      title: "Backend",
      skills: [
        {
          name: "Java",
          icon: `${this.cdn}/java/default.svg`,
        },
        {
          name: "Spring Boot",
          icon: `${this.cdn}/spring-boot/default.svg`,
        },
        {
          name: "Spring Data JPA",
          icon: `${this.cdn}/spring/default.svg`,
        },
        {
          name: "Hibernate",
          icon: `${this.cdn}/hibernate/default.svg`,
        },
        {
          name: "Spring Security",
          icon: `${this.cdn}/spring-security/default.svg`,
        },
        {
          name: "JWT",
          icon: `${this.cdn}/jwt/default.svg`,
        },
        {
          name: "REST API",
          icon: `${this.cdn}/swagger/default.svg`,
        },
        {
          name: "GraphQL",
          icon: `${this.cdn}/graphql/default.svg`,
        },
        {
          name: "gRPC",
          icon: `${this.cdn}/grpc/default.svg`,
        },
        {
          name: "WebSocket",
          icon: `${this.cdn}/socket-io/default.svg`,
        },
        {
          name: "Microservices",
          icon: `${this.cdn}/k8s-service/default.svg`,
        },
        {
          name: "Apache Kafka",
          icon: `${this.cdn}/apache-kafka/default.svg`,
        },
        {
          name: "Nginx",
          icon: `${this.cdn}/nginx/default.svg`,
        },
        {
          name: "Maven",
          icon: `${this.cdn}/apache-maven/default.svg`,
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Frontend
    // -------------------------------------------------------------------------
    {
      title: "Frontend",
      skills: [
        {
          name: "HTML5",
          icon: `${this.cdn}/html5/default.svg`,
        },
        {
          name: "CSS3",
          icon: `${this.cdn}/css3/default.svg`,
        },
        {
          name: "JavaScript",
          icon: `${this.cdn}/javascript/default.svg`,
        },
        {
          name: "TypeScript",
          icon: `${this.cdn}/typescript/default.svg`,
        },
        {
          name: "Angular",
          icon: `${this.cdn}/angular/default.svg`,
        },
        {
          name: "NgRx",
          icon: `${this.cdn}/ngrx/default.svg`,
        },
        {
          name: "React",
          icon: `${this.cdn}/react/light.svg`,
        },
        {
          name: "Next.js",
          icon: `${this.cdn}/nextjs/default.svg`,
        },
        {
          name: "Material UI",
          icon: `${this.cdn}/material-ui/default.svg`,
        },
        {
          name: "Tailwind CSS",
          icon: `${this.cdn}/tailwindcss/default.svg`,
        },
        {
          name: "Chakra UI",
          icon: `${this.cdn}/chakra-ui/default.svg`,
        },
        {
          name: "Microfrontend Architecture",
          icon: `${this.cdn}/webpack/default.svg`,
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Databases
    // -------------------------------------------------------------------------
    {
      title: "SKILLS.DATABASES",
      skills: [
        {
          name: "PostgreSQL",
          icon: `${this.cdn}/postgresql/default.svg`,
        },
        {
          name: "MySQL",
          icon: `${this.cdn}/mysql/default.svg`,
        },
        {
          name: "MongoDB",
          icon: `${this.cdn}/mongodb/default.svg`,
        },
        {
          name: "Redis",
          icon: `${this.cdn}/redis/default.svg`,
        },
        {
          name: "Firebase",
          icon: `${this.cdn}/firebase/default.svg`,
        },
        {
          name: "Supabase",
          icon: `${this.cdn}/supabase/default.svg`,
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Cloud & DevOps
    // -------------------------------------------------------------------------
    {
      title: "SKILLS.CLOUD_AND_DEVOPS",
      skills: [
        {
          name: "AWS",
          icon: `${this.cdn}/aws/default.svg`,
        },
        {
          name: "Docker",
          icon: `${this.cdn}/docker/default.svg`,
        },
        {
          name: "Kubernetes",
          icon: `${this.cdn}/kubernetes/default.svg`,
        },
        {
          name: "GitHub Actions",
          icon: `${this.cdn}/github-actions/default.svg`,
        },
        {
          name: "GitLab CI/CD",
          icon: `${this.cdn}/gitlab/default.svg`,
        },
        {
          name: "Linux",
          icon: `${this.cdn}/linux/default.svg`,
        },
        {
          name: "Bash",
          icon: `${this.cdn}/bash/default.svg`,
        },
        {
          name: "Prometheus",
          icon: `${this.cdn}/prometheus/default.svg`,
        },
        {
          name: "Grafana",
          icon: `${this.cdn}/grafana/default.svg`,
        },
        {
          name: "Kibana",
          icon: `${this.cdn}/kibana/default.svg`,
        },
        {
          name: "Selenium",
          icon: `${this.cdn}/selenium/default.svg`,
        },
        {
          name: "Playwright",
          icon: `${this.cdn}/playwright/default.svg`,
        },
        {
          name: "Cypress",
          icon: `${this.cdn}/cypress/default.svg`,
        },
      ],
    },

    // -------------------------------------------------------------------------
    // Tools & Methodologies
    // -------------------------------------------------------------------------
    {
      title: "SKILLS.TOOLS_AND_METHODOLOGIES",
      skills: [
        {
          name: "Git",
          icon: `${this.cdn}/git/default.svg`,
        },
        {
          name: "GitHub",
          icon: `${this.cdn}/github/default.svg`,
        },
        {
          name: "GitLab",
          icon: `${this.cdn}/gitlab/default.svg`,
        },
        {
          name: "Postman",
          icon: `${this.cdn}/postman/default.svg`,
        },
        {
          name: "Figma",
          icon: `${this.cdn}/figma/default.svg`,
        },
        {
          name: "Notion",
          icon: `${this.cdn}/notion/default.svg`,
        },
        {
          name: "Design Patterns",
          icon: `${this.cdn}/aws-group-aws-account/default.svg`,
        },
        {
          name: "SKILLS.SOFTWARE_ARCHITECTURE",
          icon: `${this.cdn}/k8s-service/default.svg`,
        },
        {
          name: "SKILLS.ALGORITHMS_AND_DATA_STRUCTURES",
          icon: `${this.cdn}/aws-aws-infrastructure-composer/default.svg`,
        },
        {
          name: "SKILLS.AI_ASSISTED_DEVELOPMENT",
          icon: `${this.cdn}/claude-code/default.svg`,
        },
      ],
    },
  ];
}
