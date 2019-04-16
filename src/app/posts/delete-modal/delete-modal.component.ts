import { Component, OnInit, Output, EventEmitter } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit {

  @Output() isDeleted = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  showModal() {
    $('#exampleModal').modal('toggle');
  }

  closeModal() {
    $('#exampleModal').modal('hide');
  }

  onConfirmDelete() {
    this.isDeleted.emit(true);
  }

}
