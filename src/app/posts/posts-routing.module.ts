import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { DetailComponent } from './detail/detail.component';
import { NewComponent } from './new/new.component';

const routes: Routes = [
  { path: '', component: ContainerComponent },
  { path: 'post/new', component: NewComponent },
  { path: 'post/:id', component: DetailComponent },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
