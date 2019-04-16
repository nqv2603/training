import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTitle'
})
export class FormatTitlePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let result = `<span class="text-primary font-weight-bold">${value.title.rendered}</span>`;
    let isNewNote = false;
    if (value.content.protected) {
      isNewNote = true;
      result += '<span class="ml-2 font-weight-bold text-secondary">Password protected</span>';
    }
    if (value.status !== 'publish' && isNewNote) {
      result += '<span class="font-weight-bold text-secondary">,</span>';
    }
    if (value.status === 'private') {
      isNewNote = true;
      result += '<span class="ml-2 font-weight-bold text-secondary">Private</span>';
    } else if (value.status === 'future') {
      isNewNote = true;
      result += '<span class="ml-2 font-weight-bold text-secondary">Scheduled</span>';
    } else if (value.status === 'draft') {
      isNewNote = true;
      result += '<span class="ml-2 font-weight-bold text-secondary">Draft</span>';
    }
    if (value.sticky && isNewNote) {
      result += '<span class="font-weight-bold text-secondary">,</span>';
    }
    if (value.sticky) {
      result += '<span class="ml-2 font-weight-bold text-secondary">Sticky</span>';
    }
    return result;
  }

}
