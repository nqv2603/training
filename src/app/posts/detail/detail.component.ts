import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PostsService } from '../posts.service';
import { DataService } from '../data.service';
import { Post } from '../interface/post';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  currentPost: Post;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => this.postsService.get(params.get('id')))
    ).subscribe(
      data => {
        this.currentPost = data[0];
        console.log(this.currentPost);
      }
    );
  }

}
