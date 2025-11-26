import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, Routes } from '@angular/router';
import { routes } from './app/app-routing';
import { provideHttpClient } from '@angular/common/http';


bootstrapApplication(App, {
  providers: [provideRouter(routes), provideHttpClient()],
});
