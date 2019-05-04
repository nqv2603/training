import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';
import { TagsService } from '../tags.service';
import { Tag } from '../interface/tag';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Observable, interval, timer, Subject } from 'rxjs';
import { flatMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-quick-edit',
  templateUrl: './quick-edit.component.html',
  styleUrls: ['./quick-edit.component.scss']
})
export class QuickEditComponent implements OnInit {

  viewObject = Object;
  tempStatus: string;
  tempCategories: number[];
  tempTags = '';
  tempDate: Date;
  @Input() title: string;
  @Input() slug: string;
  @Input() date: Date;
  @Input() password: string;
  @Input() status: string;
  @Input() sticky: boolean;
  @Input() categories: number[];
  @Input() tags: number[];
  @Output() cancel = new EventEmitter<null>();
  @Output() update = new EventEmitter<any>();

  constructor(
    private dataService: DataService,
    private tagsService: TagsService
  ) { }

  ngOnInit() {
    this.tempDate = new Date(this.date);
    this.tempCategories = this.categories ? [...this.categories] : [];
    this.tags.forEach((tagId, index) => {
      this.tempTags += this.dataService.tags[tagId].name;
      if (index !== this.tags.length - 1) {
        this.tempTags += ', ';
      }
    });
  }

  onChangePrivate() {
    if (this.status === 'private') {
      this.status = this.tempStatus || 'published';
    } else {
      this.status = 'private';
      this.password = null;
    }
  }

  onChangeStatus(status: string) {
    this.tempStatus = status;
    if (this.status !== 'private') {
      this.status = this.tempStatus;
    }
  }

  onChangeCategories(id: number) {
    if (this.tempCategories.indexOf(id) > -1) {
      this.tempCategories.splice(this.tempCategories.indexOf(id), 1);
    } else {
      this.tempCategories.push(id);
    }
  }

  onCancelQuickEdit() {
    this.cancel.emit();
  }

  onUpdateQuickEdit() {
    this.updateTags().subscribe(tags => {
      console.log(tags);
      this.update.emit({
        title: this.title,
        slug: this.slug,
        password: this.password,
        status: this.status,
        categories: this.tempCategories,
        tags,
        sticky: this.sticky
      });
    });
  }

  updateTags(): Observable<any> {
    let tagsName: string[] = [];
    const tagsId: number[] = [];
    const checkFinish = {};
    const update$ = new Subject();
    tagsName = this.tempTags.replace(/\s/g, '').split(',');
    // remove duplicate item
    tagsName = tagsName.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
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
    return update$;
  }

}
