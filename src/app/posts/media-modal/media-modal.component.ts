import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';
import { MediaService } from '../media.service';
declare const $: any;

@Component({
  selector: 'app-media-modal',
  templateUrl: './media-modal.component.html',
  styleUrls: ['./media-modal.component.scss']
})
export class MediaModalComponent implements OnInit {

  active = 'upload';
  selectedMedia: number;
  @Output() selectMedia = new EventEmitter<number>();

  constructor(
    private dataService: DataService,
    private mediaService: MediaService
  ) { }

  ngOnInit() {
  }

  showModal() {
    $('#mediaModal').modal('toggle');
  }

  closeModal() {
    $('#mediaModal').modal('hide');
  }

  onChangeDivision(item: string) {
    this.active = item;
  }

  onSelectMedia(id: number) {
    if (this.selectedMedia === id) {
      this.selectedMedia = null;
    } else {
      this.selectedMedia = id;
    }
  }

  onCreateMedia(files: FileList) {
    console.log(files.item(0));
    this.mediaService.create(files.item(0)).subscribe(
      data => {
        this.dataService.media.unshift(data);
        this.active = 'library';
      }
    );
  }

  onSelect() {
    this.selectMedia.emit(this.selectedMedia);
    this.closeModal();
  }
}
