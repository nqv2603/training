import { Injectable } from '@angular/core';
import { Tag } from './interface/tag';
import { Category } from './interface/category';
import { User } from './interface/user';
import { UsersService } from './users.service';
import { TagsService } from './tags.service';
import { CategoriesService } from './categories.service';
import { MediaService } from './media.service';
import { Media } from './interface/media';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  total: number;
  totalPages: number;
  posts = [];
  private tagsStore = {};
  private categoriesStore = {};
  private usersStore = {};
  private mediaStore = [];

  constructor(
    private usersService: UsersService,
    private tagsService: TagsService,
    private categoriesService: CategoriesService,
    private mediaService: MediaService
  ) {
    this.categoriesService.getAllCategories().subscribe(
      data => {
        this.categories = data;
        console.log('cate', this.categories);
      }
    );

    this.tagsService.getAllTags().subscribe(
      data => {
        this.tags = data;
        console.log('tag', this.tags);
      }
    );

    this.usersService.getAllUsers().subscribe(
      data => {
        this.users = data;
        console.log('user', this.users);
      }
    );

    this.mediaService.getAll().subscribe(
      (data: Media[]) => {
        this.media = data;
        console.log('media', this.media);
      }
    );
  }

  addNewTag(tag: Tag) {
    this.tags[tag.id] = tag;
    // this.listTagName.push(tag.name);
  }

  get tags() {
    return this.tagsStore;
  }

  set tags(data) {
    for (const tag of data as Tag[]) {
      this.tagsStore[tag.id] = tag;
      // this.listTagName.push(category.name);
    }
  }

  get categories() {
    return this.categoriesStore;
  }

  set categories(data) {
    for (const category of data as Category[]) {
      this.categoriesStore[category.id] = category;
    }
  }

  get users() {
    return this.usersStore;
  }

  set users(data) {
    for (const user of data as User[]) {
      this.usersStore[user.id] = user;
    }
  }

  get media() {
    return this.mediaStore;
  }

  set media(data) {
    this.mediaStore = data;
  }

  findMediaById(id: number) {
    return this.media.filter(media => {
      return media.id === id;
    })[0];
  }
}
