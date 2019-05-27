import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private httpClient: HttpClient) { }

  getAll() {
    return this.httpClient.get(environment.baseUrl + 'media',
      {
        params: new HttpParams().set('per_page', '100')
      });
  }

  create(file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post(
      environment.baseUrl + 'media',
      formData,
      {
        headers: new HttpHeaders()
          .set('content-disposition', `attachment; filename=${file.name}`)
      });
  }
}
