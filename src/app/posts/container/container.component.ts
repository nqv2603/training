import { Component, OnInit, ViewChild } from '@angular/core';
import { PostsService } from '../posts.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../categories.service';
import { TagsService } from '../tags.service';
import { UsersService } from '../users.service';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, filter } from 'rxjs/operators';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  viewObject = Object;
  check = {};
  quickEdit: number = null;
  postForDelete: { id: number, index: number } = null;
  isSticky: BehaviorSubject<boolean> = new BehaviorSubject(false);
  page$: BehaviorSubject<number> = new BehaviorSubject(1);
  status$: BehaviorSubject<string> = new BehaviorSubject('any');
  search$: BehaviorSubject<string> = new BehaviorSubject('');
  category$: BehaviorSubject<number> = new BehaviorSubject(0);
  orderBy$: BehaviorSubject<string> = new BehaviorSubject('date');
  order$: BehaviorSubject<string> = new BehaviorSubject('desc');
  reload$: BehaviorSubject<any> = new BehaviorSubject(null);
  @ViewChild(DeleteModalComponent) deleteModal: DeleteModalComponent;

  constructor(
    private postsService: PostsService,
    private dataService: DataService,
    private categoriesService: CategoriesService,
    private tagsService: TagsService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    combineLatest(
      this.page$.pipe(distinctUntilChanged()),
      this.status$.pipe(distinctUntilChanged()),
      this.category$.pipe(distinctUntilChanged()),
      this.search$.pipe(distinctUntilChanged()),
      this.orderBy$.pipe(distinctUntilChanged()),
      this.order$.pipe(distinctUntilChanged()),
      this.reload$
    ).pipe(
      debounceTime(500),
      filter(([page, status, category, search, orderBy, order]) => {
        return page >= 1 && page <= this.dataService.totalPages || !this.dataService.totalPages;
      }),
      switchMap(([page, status, category, search, orderBy, order]) => {
        return this.postsService.getAll(page, status, category, search, orderBy, order);
      })
    ).subscribe(
      data => {
        console.log(data);
        this.check = {};
        this.dataService.total = data.total;
        this.dataService.totalPages = data.totalPages;
        this.dataService.posts = data.posts;
      }
    );
  }

  onChangePage(page: number) {
    this.page$.next(page);
  }

  onChangeStatus(status: string) {
    this.status$.next(status);
  }

  onChangeSearch(search: string) {
    this.search$.next(search);
  }

  onChangeCategory(category: number) {
    this.category$.next(category);
  }

  onCheckAll() {
    if (Object.keys(this.check).length < this.dataService.posts.length) {
      Object.keys(this.dataService.posts).forEach((value, index) => {
        this.check[index] = true;
      });
    } else {
      this.check = {};
    }
  }

  onChangeOrder(orderBy: string) {
    if (orderBy !== this.orderBy$.value) {
      this.orderBy$.next(orderBy);
    } else {
      this.order$.value === 'desc' ? this.order$.next('asc') : this.order$.next('desc');
    }
  }

  onChangeCheckbox(index: number) {
    if (this.check[index]) {
      delete this.check[index];
    } else {
      this.check[index] = true;
    }
  }

  onPrev() {
    if (this.page$.value > 1) {
      this.onChangePage(this.page$.value - 1);
    }
  }

  onNext() {
    if (this.page$.value < this.dataService.totalPages) {
      this.onChangePage(this.page$.value + 1);
    }

  }

  onFirst() {
    this.onChangePage(1);
  }

  onLast() {
    this.onChangePage(this.dataService.totalPages);
  }

  onMoveToTrash(id: number, index: number) {
    this.postsService.moveToTrash(id).subscribe(
      () => {
        this.reload$.next(null);
        delete this.check[index];
      }
    );
  }

  onDelete(id: number, index: number) {
    this.postForDelete = { id, index };
    this.deleteModal.showModal();
  }

  onConfirmDelete(event: boolean) {
    this.postsService.delete(this.postForDelete.id).subscribe(
      () => {
        this.reload$.next(null);
        delete this.check[this.postForDelete.index];
        this.deleteModal.closeModal();
      }
    );
  }

  onBulkMoveToTrash() {
    Object.keys(this.check).forEach(key => {
      this.onMoveToTrash(this.dataService.posts[key].id, Number(key));
    });
  }

  onView(id: number) {
    this.router.navigate(['post', id]);
  }

  onShowQuickEdit(index: number) {
    this.quickEdit = index;
  }

  onCancelQuickEdit() {
    this.quickEdit = null;
  }

  onUpdateQuickEdit(option: any) {
    this.postsService.update(this.dataService.posts[this.quickEdit].id, option).subscribe(
      data => {
        this.dataService.posts[this.quickEdit] = data;
        this.quickEdit = null;
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }
}
