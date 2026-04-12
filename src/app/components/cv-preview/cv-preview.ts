import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faDownload,
  faXmark,
  faColumns,
  faScroll,
  faSearchPlus,
  faSearchMinus,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import { SafeUrlPipe } from './safe-url.pipe';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language-service';

@Component({
  selector: 'app-cv-preview',
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  templateUrl: './cv-preview.html',
})
export class CvPreview {
  faDownload = faDownload;
  faXmark = faXmark;
  faColumns = faColumns;
  faScroll = faScroll;
  faSearchPlus = faSearchPlus;
  faSearchMinus = faSearchMinus;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  constructor(private translateService: TranslateService, private languageService: LanguageService) { }

  showModal = false;
  viewMode: 'scroll' | 'dual' = 'scroll';
  currentPage = 1;
  zoom = 100;
  totalPages = 2;

  cvImages = [
    'assets/docs/cv_01.jpg',
    'assets/docs/cv_02.jpg'
  ];
  cvPdfUrl = 'assets/docs/cv.pdf';

  openModal(): void {
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.showModal = false;
    document.body.style.overflow = 'auto';
  }

  setViewMode(mode: 'scroll' | 'dual'): void {
    this.viewMode = mode;
    if (mode === 'dual') {
      this.currentPage = 1;
    }
  }

  zoomIn(): void {
    if (this.zoom < 150) {
      this.zoom += 10;
    }
  }

  zoomOut(): void {
    if (this.zoom > 50) {
      this.zoom -= 10;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  downloadCV(): void {
    const link = document.createElement('a');
    link.href = this.cvPdfUrl;
    link.download = 'KENNICHE_ABDERRAZAK_CV.pdf';
    link.click();
  }

  getZoomStyle(): { [key: string]: string } {
    return {
      'transform': `scale(${this.zoom / 100})`,
      'transform-origin': 'top center'
    };
  }

  formatCvInfo(format: string, size: number, date: string): string {
    return this.translateService.instant('CV.FORMAT_SIZE_UPDATED', {
      FORMAT: format,
      SIZE: size,
      DATE: date
    });
  }

  get getCVInfo(): string {
    return this.formatCvInfo('PDF', 200, this.languageService.formatDate(Date()));
  }
}