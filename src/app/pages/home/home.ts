import { Component, OnInit } from '@angular/core';
import { EducationComponent } from '../../components/education/education';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { Projects } from '../../components/projects/projects';
import { Skills } from '../../components/skills/skills';
import { Hero } from '../../components/hero/hero';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../services/language-service';

@Component({
  selector: 'app-home',
  imports: [Header, Hero, EducationComponent, Projects, Skills, Contact, Footer],
  templateUrl: './home.html',
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
