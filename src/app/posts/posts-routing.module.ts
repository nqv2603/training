import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContainerComponent } from './container/container.component';
import { DetailComponent } from './detail/detail.component';
import { NewComponent } from './new/new.component';
import { TagsComponent } from './tags/tags.component';
import { CategoriesComponent } from './categories/categories.component';

const routes: Routes = [
  { path: 'posts', component: ContainerComponent },
  { path: 'post/new', component: NewComponent },
  { path: 'post/:id', component: DetailComponent },
  { path: 'categories', component: CategoriesComponent},
  { path: 'tags', component: TagsComponent},
  { path: '**', redirectTo: 'posts'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
