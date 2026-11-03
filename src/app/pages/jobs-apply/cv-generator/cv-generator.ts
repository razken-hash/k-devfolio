
import {
  Component,
  inject,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import { CvGeneratorService } from '../../../services/cv-generator.service';
import { JobApplicationsService } from '../../../services/job-applications.service';

import { CvProfile } from '../../../models/cv-generator.model';
import {
  JobApplicationResponse
} from '../../../models/job-application.model';

import { finalize, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-cv-generator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cv-generator.html',
  styleUrl: './cv-generator.css'
})
export class CvGenerator implements OnDestroy {

  private readonly cvService = inject(CvGeneratorService);
  private readonly applicationsService = inject(JobApplicationsService);
  private readonly sanitizer = inject(DomSanitizer);

  // Job information
  companyName = '';
  roleName = '';
  offerUrl = '';
  jobDescription = '';

  // CV profile
  selectedProfile: CvProfile = 'DEV';

  // Generated CV
  latexCode = '';

  // PDF preview
  private pdfObjectUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;

  // Loading states
  isGenerating = false;
  isCompiling = false;
  isSaving = false;

  // Feedback
  errorMessage = '';
  successMessage = '';

  // Saved application
  application: JobApplicationResponse | null = null;

  get canGenerate(): boolean {
    return (
      this.jobDescription.trim().length > 0 &&
      !this.isGenerating
    );
  }

  get canCompile(): boolean {
    return (
      this.latexCode.trim().length > 0 &&
      !this.isCompiling &&
      !this.isSaving
    );
  }

  get canFinish(): boolean {
    return (
      this.companyName.trim().length > 0 &&
      this.roleName.trim().length > 0 &&
      this.jobDescription.trim().length > 0 &&
      this.latexCode.trim().length > 0 &&
      !this.isSaving
    );
  }

  selectProfile(profile: CvProfile): void {
    this.selectedProfile = profile;
    this.errorMessage = '';
    this.successMessage = '';

    // A profile change means the current CV may no longer match.
    this.clearPdf();
  }

  generateCv(): void {
    if (!this.canGenerate) {
      return;
    }

    this.isGenerating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cvService.generate({
      profileType: this.selectedProfile,
      jobDescription: this.jobDescription
    })
      .pipe(
        finalize(() => {
          this.isGenerating = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.latexCode = response.latexCode;
          this.clearPdf();
        },
        error: (error) => {
          console.error('CV generation failed:', error);
          this.errorMessage =
            'Unable to generate the CV. Please try again.';
        }
      });
  }

  compilePdf(): void {
    if (!this.canCompile) {
      return;
    }

    this.isCompiling = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.cvService.compile({
      latexCode: this.latexCode
    })
      .pipe(
        finalize(() => {
          this.isCompiling = false;
        })
      )
      .subscribe({
        next: (pdfBlob) => {
          this.setPdf(pdfBlob);
        },
        error: (error) => {
          console.error('PDF compilation failed:', error);
          this.errorMessage =
            'PDF compilation failed. Please check your LaTeX code.';
        }
      });
  }

  finish(): void {
    if (!this.canFinish) {
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Compile the latest editor content before saving.
    this.cvService.compile({
      latexCode: this.latexCode
    })
      .pipe(
        tap((pdfBlob) => {
          this.setPdf(pdfBlob);
        }),
        switchMap(() =>
          this.applicationsService.create({
            companyName: this.companyName.trim(),
            offerUrl: this.offerUrl.trim(),
            roleName: this.roleName.trim(),
            profileType: this.selectedProfile,
            jobDescription: this.jobDescription,
            latexCode: this.latexCode
          })
        ),
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.application = response;
          this.successMessage =
            `Application ${response.id} saved successfully.`;
        },
        error: (error) => {
          console.error('Unable to finish application:', error);
          this.errorMessage =
            'Unable to compile the PDF or save the application.';
        }
      });
  }

  private setPdf(blob: Blob): void {
    this.clearPdf();

    this.pdfObjectUrl = URL.createObjectURL(
      new Blob([blob], { type: 'application/pdf' })
    );

    this.safePdfUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(
        this.pdfObjectUrl
      );
  }

  private clearPdf(): void {
    if (this.pdfObjectUrl) {
      URL.revokeObjectURL(this.pdfObjectUrl);
      this.pdfObjectUrl = null;
    }

    this.safePdfUrl = null;
  }

  ngOnDestroy(): void {
    this.clearPdf();
  }
}
