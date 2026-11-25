import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../../../../core/layout/header/header';
import { Footer } from '../../../../core/layout/footer/footer';
import { Projects } from '../../components/projects/projects';

@Component({
  selector: 'app-projects-page',
  imports: [Header, Projects, Footer],
  templateUrl: './projects-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``,
})
export class ProjectsPage {}
