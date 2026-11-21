import { LowerCasePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-details',
  imports: [LowerCasePipe, RouterModule, TranslateModule, FontAwesomeModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './contact-details.html',
})
export class ContactDetails {
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faLocationDot = faLocationDot;
}
