import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { PostsService } from '../posts.service';
import { UserService } from 'src/app/share/user.service';
import { Post } from '../interface/post';
import { Router, Event } from '@angular/router';
import { DataService } from '../data.service';
import { fromEvent, BehaviorSubject, combineLatest, Observable, Subject, of } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Category } from '../interface/category';
import { CategoriesService } from '../categories.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TagsService } from '../tags.service';
import { Tag } from '../interface/tag';
import { MediaModalComponent } from '../media-modal/media-modal.component';
import { MediaService } from '../media.service';
import { Media } from '../interface/media';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  editor = ClassicEditor;
  id: number;
  isSaved: boolean;
  isPublishing: boolean;
  config = {
    placeholder: 'Start writing or type...'
  };
  sticky: boolean;
  viewObject = Object;
  media: Media;
  tags: Array<any> = [];
  categorySearch = '';
  categories: Array<Category>;
  selectedCategories: Array<number> = [];
  category$: BehaviorSubject<string> = new BehaviorSubject('');
  @ViewChild('titleInput') titleInput: ElementRef;
  ckeditor$: BehaviorSubject<string> = new BehaviorSubject('');
  @ViewChild(MediaModalComponent) mediaModal: MediaModalComponent;

  constructor(
    private postsService: PostsService,
    private userService: UserService,
    private dataService: DataService,
    private categoriesService: CategoriesService,
    private tagsService: TagsService,
    private router: Router
  ) { }

  ngOnInit() {
    combineLatest(
      fromEvent(this.titleInput.nativeElement, 'keyup').pipe(
        distinctUntilChanged(),
        map((e: any) => e.currentTarget.value)
      ),
      this.ckeditor$.pipe(
        distinctUntilChanged()
      )
    ).pipe(
      debounceTime(5000)
    ).subscribe(
      () => {
        this.onSaveDraft();
      }
    );

    this.category$
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000)
      )
      .subscribe(
        text => {
          this.categorySearch = text;
          this.searchCategory();
        }
      );
  }

  get title() {
    return this.titleInput.nativeElement.value;
  }

  get content() {
    return this.ckeditor$.getValue();
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload($event: any) {
    if (this.hasUnsavedData()) {
      $event.returnValue = true;
    }
  }

  hasUnsavedData() {
    return !this.isPublishing && !this.isSaved && (this.title || this.content);
  }

  onSearchCategory(event: any) {
    this.category$.next(event.target.value);
  }

  searchCategory() {
    this.categories = [];
    const text = this.categorySearch.toLowerCase();
    for (const key of Object.keys(this.dataService.categories)) {
      const category = this.dataService.categories[key] as Category;
      if (category.name.toLowerCase().includes(text)) {
        this.categories.push(category);
      }
    }
  }

  onSelectCategory(id: number) {
    const index = this.selectedCategories.indexOf(id);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(id);
    }
    console.log(this.selectedCategories);
  }

  onAddNewCategory(name: string, parent: string) {
    this.categoriesService.create({
      name,
      parent: parent !== 'null' ? Number(parent) : null
    }).subscribe(
      (data: Category) => {
        this.dataService.categories[data.id] = data;
        this.searchCategory();
      }
    );
  }

  onChange(event?: any) {
    this.isSaved = false;
    if (event) {
      this.ckeditor$.next(event.editor.getData());
    }
  }

  onSaveDraft() {
    if (this.isPublishing) {
      return;
    }
    if (!this.id) {
      this.postsService.create({
        title: this.titleInput.nativeElement.value,
        content: this.ckeditor$.getValue(),
        status: 'draft',
        author: this.userService.currentUser.id
      }).subscribe(
        (post: Post) => {
          this.id = post.id;
          this.isSaved = true;
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.postsService.update(this.id, {
        title: this.titleInput.nativeElement.value,
        content: this.ckeditor$.getValue(),
        status: 'draft',
        author: this.userService.currentUser.id
      }).subscribe(
        () => {
          this.isSaved = true;
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  onPublish() {
    this.isPublishing = true;
    this.tags = this.tags.map(
      (tag: any) => tag.value
    );
    this.updateTags(this.tags).subscribe(
      tags => {
        if (!this.id) {
          this.postsService.create({
            title: this.titleInput.nativeElement.value,
            content: this.ckeditor$.getValue(),
            status: 'publish',
            author: this.userService.currentUser.id,
            categories: this.selectedCategories,
            tags,
            featured_media: this.media ? this.media.id : null,
            sticky: this.sticky
          }).subscribe(
            data => {
              this.dataService.posts.unshift(data);
              this.router.navigate(['']);
            },
            error => {
              console.log(error);
            }
          );
        } else {
          this.postsService.update(this.id, {
            title: this.titleInput.nativeElement.value,
            content: this.ckeditor$.getValue(),
            status: 'publish',
            author: this.userService.currentUser.id,
            categories: this.selectedCategories,
            tags,
            featured_media: this.media ? this.media.id : null,
            sticky: this.sticky
          }).subscribe(
            data => {
              this.dataService.posts.unshift(data);
              this.router.navigate(['']);
            },
            error => {
              console.log(error);
            }
          );
        }
      }
    );
  }

  updateTags(tagsName: string[]): Observable<any> {
    const tagsId: number[] = [];
    const checkFinish = {};
    const update$ = new Subject();
    tagsName.forEach((tagName, index) => {
      let id: number;
      for (const tagId of Object.keys(this.dataService.tags)) {
        if (this.dataService.tags[tagId].name === tagName) {
          id = this.dataService.tags[tagId].id;
          break;
        }
      }
      if (id) {
        tagsId.push(id);
        if (index === tagsName.length - 1 && !Object.keys(checkFinish).length) {
          setTimeout(() => {
            update$.next(tagsId);
          });
        }
      } else {
        checkFinish[tagName] = false;
        this.tagsService.creat({ name: tagName }).pipe(
          finalize(() => {
            delete checkFinish[tagName];
            if (!Object.keys(checkFinish).length) {
              update$.next(tagsId);
            }
          })
        ).subscribe(
          (data: Tag) => {
            this.dataService.addNewTag(data);
            tagsId.push(data.id);
          },
          (error: HttpErrorResponse) => {
            console.log(error);
          }
        );
      }
    });
    if (!tagsName.length) {
      return of([]);
    }
    return update$;
  }

  onShowMediaModal() {
    this.mediaModal.showModal();
  }

  onSelectMedia(id: number) {
    this.media = this.dataService.findMediaById(id);
  }

  removeMedia() {
    this.media = null;
  }

}
