import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

import { faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { ContactForm } from '../../models/contact.model';


@Component({
  selector: 'app-contact',
  imports: [CommonModule, RouterModule, FontAwesomeModule, FormsModule],
  templateUrl: './contact.html',
  styles: ``,
})
export class Contact {
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faLocationDot = faLocationDot;

  formData: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
    sentAt: new Date(),
  };

  onSubmit(): void {
    console.log('Form submitted:', this.formData);
  }
}