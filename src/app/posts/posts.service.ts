import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient: HttpClient) { }

  getPosts(page: number, status: string) {
    return this.httpClient.get(
      environment.baseUrl + 'posts',
      {
        params: new HttpParams().set('page', page.toString()).set('status', status),
        observe: 'response'
      }
    ).pipe(
      map(data => {
        return {
          posts: data.body,
          total: Number(data.headers.get('X-WP-Total')),
          totalPages: Number(data.headers.get('X-WP-TotalPages'))
        };
      })
    );
  }
}
