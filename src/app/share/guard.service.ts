import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (route.data.role === 'member') {
      if (!this.userService.currentUser) {
        this.router.navigate(['/auth/login']);
        return false;
      }
      return true;
    } else if (route.data.role === 'guest') {
      if (this.userService.currentUser) {
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }
  }
}
