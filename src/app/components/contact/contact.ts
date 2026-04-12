import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ContactDetails } from './contact-details/contact-details';
import { ContactForm } from './contact-form/contact-form';


@Component({
  selector: 'app-contact',
  imports: [CommonModule, TranslateModule, ContactDetails, ContactForm],
  templateUrl: './contact.html',
  styles: ``,
})
export class Contact {

}