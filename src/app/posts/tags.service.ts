import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { retryWhen, map, tap, delayWhen, mergeMap } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { Tag } from './interface/tag';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor(private httpClient: HttpClient) { }

  getAllTags(): Observable<Tag[]> {
    let page = 1;
    let tags: Tag[] = [];
    return timer(0)
      .pipe(
        mergeMap(() => {
          return this.httpClient.get<Tag[]>(
            environment.baseUrl + 'tags',
            {
              params: new HttpParams().set('per_page', '100').append('page', page.toString()),
              observe: 'response'
            }
          )
            .pipe(
              tap(data => {
                page++;
                tags = tags.concat(data.body);
              }),
              map(data => {
                if (tags.length < Number(data.headers.get('x-wp-total'))) {
                  throw data;
                }
                return tags;
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
}
