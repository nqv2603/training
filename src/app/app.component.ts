import { Component } from '@angular/core';
import { UserService } from './share/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(private userService: UserService) {
    if (localStorage.getItem('currentUser')) {
      this.userService.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

}
