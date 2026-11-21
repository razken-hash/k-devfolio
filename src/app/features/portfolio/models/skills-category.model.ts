import { Skill } from "../../../shared/models/skill.model";

export interface SkillCategory {
    title: string;
    skills: Skill[];
}