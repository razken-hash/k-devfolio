
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ContactDetails } from './contact-details/contact-details';
import { ContactForm } from './contact-form/contact-form';


@Component({
  selector: 'app-contact',
  imports: [TranslateModule, ContactDetails, ContactForm],
  templateUrl: './contact.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class Contact {

}