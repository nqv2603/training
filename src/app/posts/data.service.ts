import { Injectable } from '@angular/core';
import { Tag } from './interface/tag';
import { Category } from './interface/category';
import { User } from './interface/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  total: number;
  totalPages: number;
  posts = [];
  tagsStore = {};
  categoriesStore = {};
  usersStore = {};

  constructor() { }

  get tags() {
    return this.tagsStore;
  }

  set tags(data) {
    for (const tag of data as Tag[]) {
      this.tagsStore[tag.id] = tag;
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
}
