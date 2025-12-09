import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { Blog } from './pages/blog/blog';
import { ArticleComponent } from './pages/article/article';
import { LanguageResolver } from './services/language-resolver';

export const routes: Routes = [

  { path: '', component: Home },  // root
  {
    path: '',
    component: Home,
    data: { openProject: null }
  },

  { path: 'home', redirectTo: '', pathMatch: 'full' },

  { path: 'blog', component: Blog },

  { path: 'blog/:articleId', component: ArticleComponent },

  { path: 'not-found', component: NotFound },

  // -------------------------
  // Routes WITH language code
  // -------------------------
  {
    matcher: (segments: any[]) => {
      if (
        segments.length > 0 &&
        /^[a-zA-Z]{2}$/.test(segments[0].path) // ✅ only 2 letters
      ) {
        return {
          consumed: [segments[0]],
          posParams: {
            languageCode: segments[0]
          }
        };
      }
      return null;
    }
    ,
    resolve: { lang: LanguageResolver },
    children: [
      { path: '', component: Home },
      {
        path: '',
        component: Home,
        data: { openProject: null }
      },
      { path: 'blog', component: Blog },
      { path: 'blog/:articleId', component: ArticleComponent },
      { path: 'not-found', component: NotFound },
      { path: '**', redirectTo: 'not-found' }
    ]
  },

  { path: '**', redirectTo: 'not-found' }
];
