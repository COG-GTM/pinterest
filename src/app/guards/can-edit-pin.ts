import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState, getPinAccessStatus } from '../reducers/index';

@Injectable()
export class CanEditPinGuard  {

  constructor(private store: Store<AppState>) {}

  canActivate() {
    return this.store.select(getPinAccessStatus);
  }
}
