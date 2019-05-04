import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { CategoriesService } from '../categories.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Category } from '../interface/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  viewObject = Object;
  categoryForm: FormGroup;
  slugError: boolean;

  constructor(
    private dataService: DataService,
    private categoriesService: CategoriesService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      parent: [],
      description: ['']
    });
  }

  onCreateNewCategory() {
    this.categoryForm.get('name').markAsTouched();
    if (this.categoryForm.valid) {
      this.categoriesService.create(this.categoryForm.value).subscribe(
        (data: Category) => {
          this.categoryForm.reset();
          this.slugError = false;
          this.dataService.categories[data.id] = data;
        },
        error => {
          if (error.error.code === 'term_exists') {
            this.slugError = true;
          }
        }
      );
    }
  }

  get name(): AbstractControl {
    return this.categoryForm.get('name');
  }
}
