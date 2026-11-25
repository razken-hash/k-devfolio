import { Routes } from '@angular/router';

import { Home } from './features/portfolio/pages/home/home';
import { NotFound } from './core/pages/not-found/not-found';
import { Blog } from './features/blog/pages/blog/blog';
import { ProjectsPage } from './features/portfolio/pages/projects/projects-page';
import { ArticleComponent } from './features/blog/pages/article/article';
import { VisitAnalyticsComponent } from './features/analytics/pages/visit-analytics/visit-analytics';

import { LanguageResolver } from './core/resolvers/language.resolver';
import { JobsApply } from './features/jobs-apply/pages/jobs-apply/jobs-apply';

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
    path: 'projects',
    component: ProjectsPage,
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
    path: 'jobs-apply',
    component: JobsApply,
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
        path: 'projects',
        component: ProjectsPage,
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
        path: 'jobs-apply',
        component: JobsApply,
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