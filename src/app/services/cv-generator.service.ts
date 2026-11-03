
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environment/environment';
import {
  GenerateCvRequest,
  GenerateCvResponse,
  CompileCvRequest
} from '../models/cv-generator.model';

@Injectable({
  providedIn: 'root'
})
export class CvGeneratorService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.backendUrl;

  generate(request: GenerateCvRequest): Observable<GenerateCvResponse> {
    return this.http.post<GenerateCvResponse>(
      `${this.apiUrl}/cv/generate`,
      request
    );
  }

  compile(request: CompileCvRequest): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/cv/compile`,
      request,
      { responseType: 'blob' }
    );
  }
}
