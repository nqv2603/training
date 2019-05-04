import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Post } from './interface/post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private httpClient: HttpClient) { }

  getAll(page: number, status: string, category: number, search: string, orderBy: string, order: string) {
    return this.httpClient.get<Post[]>(
      environment.baseUrl + 'posts',
      {
        params: this.buildGetPostsParams(page, status, category, search, orderBy, order),
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

  get(id: string) {
    return this.httpClient.get<Post[]>(
      environment.baseUrl + 'posts',
      {
        params: new HttpParams().set('include', id).append('status', 'any')
      }
    );
  }

  moveToTrash(id: number) {
    return this.httpClient.delete(environment.baseUrl + 'posts/' + id);
  }

  update(id: number, option: any) {
    return this.httpClient.put(
      environment.baseUrl + 'posts/' + id,
      option
    );
  }

  delete(id: number) {
    return this.httpClient.delete(
      environment.baseUrl + 'posts/' + id,
      {
        params: new HttpParams().set('force', 'true')
      }
    );
  }

  buildGetPostsParams(page: number, status: string, category: number, search: string, orderBy: string, order: string): HttpParams {
    let params = new HttpParams().set('page', page.toString());
    params = params.append('status', (status !== 'sticky') ? status : 'any');
    params = params.append('orderby', orderBy);
    params = params.append('order', order);
    if (status === 'sticky') {
      params = params.append('sticky', 'true');
    }
    if (category) {
      params = params.append('categories', category.toString());
    }
    if (search) {
      params = params.append('search', search);
    }
    return params;
  }
}
