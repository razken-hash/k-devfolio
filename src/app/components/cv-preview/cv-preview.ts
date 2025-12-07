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
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cv-preview',
  imports: [CommonModule, FontAwesomeModule, TranslateModule],
  templateUrl: './cv-preview.html',
  styles: []
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
    link.download = 'Kenniche_Abderrazak_CV.pdf';
    link.click();
  }

  getZoomStyle(): { [key: string]: string } {
    return {
      'transform': `scale(${this.zoom / 100})`,
      'transform-origin': 'top center'
    };
  }
}