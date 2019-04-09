import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { DataService } from '../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap, flatMap } from 'rxjs/operators';
import { CategoriesService } from '../categories.service';
import { TagsService } from '../tags.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  viewArray = Array;
  page: number;
  status: string;

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
    this.activatedRoute.queryParams.pipe(
      tap(params => {
        this.page = Number(params.page) || 1;
        this.status = params.status || '';
      }),
      flatMap(() => this.postsService.getPosts(this.page, this.status))
    ).subscribe(
      data => {
        console.log(data.posts);
        this.dataService.total = data.total;
        this.dataService.totalPages = data.totalPages;
        this.dataService.posts = data.posts as any[];
      }
    );

    this.categoriesService.getAllCategories().subscribe(
      data => {
        this.dataService.categories = data;
        console.log('cate', this.dataService.categories);
      }
    );

    this.tagsService.getAllTags().subscribe(
      data => {
        this.dataService.tags = data;
        console.log('tag', this.dataService.tags);
      }
    );

    this.usersService.getAllUsers().subscribe(
      data => {
        this.dataService.users = data;
        console.log('user', this.dataService.users);
      }
    );
  }

  onChangePage() {
    this.router.navigate([''], { queryParams: { page: this.page } });
  }

  onPrev() {
    if (this.page > 1) {
      this.router.navigate([''], { queryParams: { page: --this.page } });
    }
  }

  onNext() {
    if (this.page < this.dataService.totalPages) {
      this.router.navigate([''], { queryParams: { page: ++this.page } });
    }

  }

  onFirst() {
    this.router.navigate([''], { queryParams: { page: 1 } });
  }

  onLast() {
    this.router.navigate([''], { queryParams: { page: this.dataService.totalPages } });
  }

}
