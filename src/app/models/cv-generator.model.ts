
export type CvProfile = 'DEV' | 'QA';

export interface GenerateCvRequest {
  profileType: CvProfile;
  jobDescription: string;
}

export interface GenerateCvResponse {
  latexCode: string;
  profileType: CvProfile;
}

export interface CompileCvRequest {
  latexCode: string;
}
