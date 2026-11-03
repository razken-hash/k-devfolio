
import { CvProfile } from './cv-generator.model';

export type ApplicationStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface CreateJobApplicationRequest {
  companyName: string;
  offerUrl: string;
  roleName: string;
  profileType: CvProfile;
  jobDescription: string;
  latexCode: string;
  pdfUrl?: string;
}

export interface JobApplicationResponse {
  id: string;
  companyName: string;
  offerUrl: string;
  roleName: string;
  profileType: CvProfile;
  jobDescription: string;
  latexCode: string;
  pdfUrl: string | null;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  urlChecked: boolean;
}
