import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { TagsService } from '../tags.service';
import { Tag } from '../interface/tag';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {

  viewObject = Object;
  tagForm: FormGroup;
  slugError: boolean;

  constructor(
    private dataService: DataService,
    private tagsService: TagsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.tagForm = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      description: ['']
    });
  }

  onCreateNewTag() {
    this.name.markAsTouched();
    if (this.tagForm.valid) {
      this.tagsService.creat(this.tagForm.value).subscribe(
        (data: Tag) => {
          this.tagForm.reset('');
          this.slugError = false;
          this.dataService.addNewTag(data);
        },
        (error: HttpErrorResponse) => {
          if (error.error.code === 'term_exists') {
            this.slugError = true;
          }
        }
      );
    }
  }

  get name(): AbstractControl {
    return this.tagForm.get('name');
  }

}
