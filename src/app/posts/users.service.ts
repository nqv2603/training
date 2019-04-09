import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { User } from './interface/user';
import { mergeMap, map, retryWhen, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    let page = 1;
    let users: User[] = [];
    return timer(0)
      .pipe(
        mergeMap(() => {
          return this.httpClient.get<User[]>(
            environment.baseUrl + 'users',
            {
            params: new HttpParams().set('per_page', '100').append('page', page.toString()),
            observe: 'response'
          })
            .pipe(
              tap(data => {
                page++;
                users = users.concat(data.body);
              }),
              map(data => {
                if (users.length < Number(data.headers.get('x-wp-total'))) {
                  throw data;
                }
                return users;
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
