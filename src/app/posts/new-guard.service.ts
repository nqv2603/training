import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { NewComponent } from './new/new.component';

@Injectable({
  providedIn: 'root'
})
export class NewGuardService implements CanDeactivate<NewComponent> {

  constructor() { }

  canDeactivate(component: NewComponent): boolean {

    if (component.hasUnsavedData()) {
      if (confirm('You have unsaved changes! If you leave, your changes will be lost.')) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
