import { Component, OnInit } from '@angular/core';
import { UserService } from '../../share/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    this.userService.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }

}
