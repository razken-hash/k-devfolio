import { Component } from '@angular/core';
import { EducationComponent } from '../../components/education/education';
import { Contact } from '../../components/contact/contact';
import { Footer } from '../../components/footer/footer';
import { Header } from '../../components/header/header';
import { Projects } from '../../components/projects/projects';
import { Skills } from '../../components/skills/skills';
import { Hero } from '../../components/hero/hero';

@Component({
  selector: 'app-home',
  imports: [Header, Hero, EducationComponent, Projects, Skills, Contact, Footer],
  templateUrl: './home.html',
  styles: ``,
})
export class Home {

}
