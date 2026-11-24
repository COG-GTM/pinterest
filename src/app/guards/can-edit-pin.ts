import { Injectable, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState, getPinAccessStatus } from '../reducers/index';

@Injectable()
export class CanEditPinGuard  {
  private store = inject<Store<AppState>>(Store);


  canActivate() {
    return this.store.select(getPinAccessStatus);
  }
}
