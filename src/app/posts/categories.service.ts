import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { timer, Observable } from 'rxjs';
import { Category } from './interface/category';
import { mergeMap, map, retryWhen, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    let page = 1;
    let categories: Category[] = [];
    return timer(0)
      .pipe(
        mergeMap(() => {
          return this.httpClient.get<Category[]>(
            environment.baseUrl + 'categories',
            {
              params: new HttpParams().set('per_page', '100').append('page', page.toString()),
              observe: 'response'
            }
          )
            .pipe(
              tap(data => {
                page++;
                categories = categories.concat(data.body);
              }),
              map(data => {
                if (categories.length < Number(data.headers.get('x-wp-total'))) {
                  throw data;
                }
                return categories;
              })
            );
        })
      )
      .pipe(
        retryWhen(error =>
          error.pipe(
            // restart in 5 seconds
            // delayWhen(() => timer(5 * 1000))
          )
        )
      );
  }

  create(option: any) {
    return this.httpClient.post(environment.baseUrl + 'categories', option);
  }
}
