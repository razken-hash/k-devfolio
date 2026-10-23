import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';
import { Blog } from './pages/blog/blog';
import { ArticleComponent } from './pages/article/article';
import { VisitAnalyticsComponent } from './pages/visit-analytics/visit-analytics';

import { LanguageResolver } from './services/language-resolver';

export const routes: Routes = [
  // Default language routes
  {
    path: '',
    component: Home,
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'blog',
    component: Blog,
  },
  {
    path: 'blog/:articleId',
    component: ArticleComponent,
  },

  // Analytics
  {
    path: 'admin/analytics',
    component: VisitAnalyticsComponent,
  },

  {
    path: 'not-found',
    component: NotFound,
  },

  // Routes with a language prefix: /en/..., /fr/...
  {
    matcher: (segments) => {
      if (
        segments.length > 0 &&
        /^[a-zA-Z]{2}$/.test(segments[0].path)
      ) {
        return {
          consumed: [segments[0]],
          posParams: {
            languageCode: segments[0],
          },
        };
      }

      return null;
    },

    resolve: {
      lang: LanguageResolver,
    },

    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: 'blog',
        component: Blog,
      },
      {
        path: 'blog/:articleId',
        component: ArticleComponent,
      },
      {
        path: 'admin/analytics',
        component: VisitAnalyticsComponent,
      },
      {
        path: 'not-found',
        component: NotFound,
      },
      {
        path: '**',
        redirectTo: 'not-found',
      },
    ],
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'not-found',
  },
];