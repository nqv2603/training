import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from './share/guard.service';

const routes: Routes = [
  { path: 'auth', loadChildren: './authen/authen.module#AuthenModule', canActivate: [GuardService], data: { role: 'guest' } },
  { path: '', loadChildren: './posts/posts.module#PostsModule', canActivate: [GuardService], data: { role: 'member' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
