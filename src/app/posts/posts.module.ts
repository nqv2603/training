import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { ContainerComponent } from './container/container.component';
import { FormsModule } from '@angular/forms';
import { FormatTitlePipe } from './format-title.pipe';
import { DetailComponent } from './detail/detail.component';
import { NewComponent } from './new/new.component';
import { RouterModule } from '@angular/router';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';

@NgModule({
  declarations: [
    ContainerComponent,
    FormatTitlePipe,
    DetailComponent,
    NewComponent,
    DeleteModalComponent
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    FormsModule,
    RouterModule
  ]
})
export class PostsModule { }
