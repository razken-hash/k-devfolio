import { Injectable } from "@angular/core";
import { SkillCategory } from "../models/skills-category.model";
import { SkillIconsRepository as Skills } from "../repositories/skill-icons.repository";

@Injectable({
  providedIn: "root",
})
export class SkillsService {
  skillsData: SkillCategory[] = [
    // -------------------------------------------------------------------------
    // Backend
    // -------------------------------------------------------------------------
    {
      title: "Backend",
      skills: [
        Skills.JAVA,
        Skills.SPRING_BOOT,
        Skills.SPRING_DATA_JPA,
        Skills.HIBERNATE,
        Skills.SPRING_SECURITY,
        Skills.JWT,
        Skills.REST_API,
        Skills.GRAPHQL,
        Skills.GRPC,
        Skills.WEBSOCKET,
        Skills.MICROSERVICES,
        Skills.APACHE_KAFKA,
        Skills.NGINX,
        Skills.APACHE_MAVEN,
        Skills.SELENIUM,
      ],
    },

    // -------------------------------------------------------------------------
    // Frontend
    // -------------------------------------------------------------------------
    {
      title: "Frontend",
      skills: [
        Skills.HTML5,
        Skills.CSS3,
        Skills.JAVASCRIPT,
        Skills.TYPESCRIPT,
        Skills.ANGULAR,
        Skills.NGRX,
        Skills.REACT,
        Skills.NEXT_JS,
        Skills.MATERIAL_UI,
        Skills.TAILWIND_CSS,
        Skills.CHAKRA_UI,
        Skills.PLAYWRIGHT,
        Skills.CYPRESS,
        Skills.MICROFRONTEND_ARCHITECTURE,
      ],
    },

    // -------------------------------------------------------------------------
    // Databases
    // -------------------------------------------------------------------------
    {
      title: "SKILLS.DATABASES",
      skills: [
        Skills.POSTGRESQL,
        Skills.MYSQL,
        Skills.MONGODB,
        Skills.REDIS,
        Skills.FIREBASE,
        Skills.SUPABASE,
      ],
    },

    // -------------------------------------------------------------------------
    // Cloud & DevOps
    // -------------------------------------------------------------------------
    {
      title: "SKILLS.CLOUD_AND_DEVOPS",
      skills: [
        Skills.AWS,
        Skills.DOCKER,
        Skills.KUBERNETES,
        Skills.GITHUB_ACTIONS,
        Skills.GITLAB,
        Skills.LINUX,
        Skills.BASH,
        Skills.PROMETHEUS,
        Skills.GRAFANA,
        Skills.KIBANA,
      ],
    },

    // -------------------------------------------------------------------------
    // Tools & Methodologies
    // -------------------------------------------------------------------------
    {
      title: "SKILLS.TOOLS_AND_METHODOLOGIES",
      skills: [
        Skills.GIT,
        Skills.GITHUB,
        Skills.GITLAB,
        Skills.POSTMAN,
        Skills.FIGMA,
        Skills.NOTION,
        Skills.DESIGN_PATTERNS,
        Skills.SOFTWARE_ARCHITECTURE,
        Skills.ALGORITHMS_AND_DATA_STRUCTURES,
        Skills.AI_ASSISTED_DEVELOPMENT,
      ],
    },
  ];
}