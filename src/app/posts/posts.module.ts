import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostsRoutingModule } from './posts-routing.module';
import { ContainerComponent } from './container/container.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormatTitlePipe } from './format-title.pipe';
import { DetailComponent } from './detail/detail.component';
import { NewComponent } from './new/new.component';
import { RouterModule } from '@angular/router';
import { DeleteModalComponent } from './delete-modal/delete-modal.component';
import { QuickEditComponent } from './quick-edit/quick-edit.component';
import { TagsComponent } from './tags/tags.component';
import { CategoriesComponent } from './categories/categories.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TagInputModule } from 'ngx-chips';
import { MediaModalComponent } from './media-modal/media-modal.component';

@NgModule({
  declarations: [
    ContainerComponent,
    FormatTitlePipe,
    DetailComponent,
    NewComponent,
    DeleteModalComponent,
    QuickEditComponent,
    TagsComponent,
    CategoriesComponent,
    MediaModalComponent,
  ],
  imports: [
    CommonModule,
    PostsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CKEditorModule,
    TagInputModule,
  ]
})
export class PostsModule { }
