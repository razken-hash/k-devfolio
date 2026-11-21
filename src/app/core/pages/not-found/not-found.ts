
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-not-found',
  imports: [FormsModule, FontAwesomeModule, RouterModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./not-found.html",
})
export class NotFound {
  faHome = faHome;
  faArrowLeft = faArrowLeft;

  floatingParticles = Array(20).fill(0).map(() => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 5 + Math.random() * 10,
    delay: Math.random() * 5
  }));

  constructor() { }

  goBack(): void {
    window.history.back();
  }
}