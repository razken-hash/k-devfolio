import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

const browserLang = navigator.language.split('-')[0]; // e.g. "fr" from "fr-FR"

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: browserLang,
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(),
          deps: [HttpClient]
        }
      })
    )
  ]
};