import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ContactMessage } from '../../../models/contact.model';
import { EmailInput } from '../email-input/email-input';

@Component({
  selector: 'app-contact-form',
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule, EmailInput],
  templateUrl: './contact-form.html',
})
export class ContactForm {

  formData: ContactMessage = {
    name: '',
    email: '',
    subject: '',
    message: '',
    sentAt: new Date(),
  };

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    console.log('Form submitted:', this.formData);

    form.resetForm();
  }

  toTitleCase(value: string): string {
    if (!value) return '';

    return value
      .toLowerCase()
      .replace(/\b\p{L}/gu, (char) => char.toUpperCase());
  }


}
