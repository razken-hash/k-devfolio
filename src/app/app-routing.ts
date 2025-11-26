import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { Blog } from './pages/blog/blog';

export const routes: Routes = [

  { path: '', component: Home },  // root

  { path: 'home', redirectTo: '', pathMatch: 'full' },

  { path: 'blog', component: Blog },

  { path: 'not-found', component: NotFound },

  { path: '**', redirectTo: 'not-found' }
];
