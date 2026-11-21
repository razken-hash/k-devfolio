
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  CreateJobApplicationRequest,
  JobApplicationResponse
} from '../models/job-application.model';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationsService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.backendUrl;

  create(
    request: CreateJobApplicationRequest
  ): Observable<JobApplicationResponse> {
    return this.http.post<JobApplicationResponse>(
      `${this.apiUrl}/job-applications`,
      request
    );
  }

  findAll(): Observable<JobApplicationResponse[]> {
    return this.http.get<JobApplicationResponse[]>(
      `${this.apiUrl}/job-applications`
    );
  }

  findById(id: string): Observable<JobApplicationResponse> {
    return this.http.get<JobApplicationResponse>(
      `${this.apiUrl}/job-applications/${id}`
    );
  }
}
