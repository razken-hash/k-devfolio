import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ExperienceComponent } from '../../components/experience/experience';
import { EducationComponent } from '../../components/education/education';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../../../core/layout/footer/footer';
import { Header } from '../../../../core/layout/header/header';
import { Skills } from '../../components/skills/skills';
import { Hero } from '../../components/hero/hero';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-home',
  imports: [Header, Hero, ExperienceComponent, EducationComponent, Skills, Contact, Footer],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class Home {

  // constructor(private route: ActivatedRoute, private languageService: LanguageService) { }

  // ngOnInit(): void {
  //   this.route.params.subscribe(params => {
  //     const languageCode = params['languageCode'];
  //     this.languageService.setLanguage(languageCode);
  //   });
  // }
}
