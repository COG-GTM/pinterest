import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState, getUserAuthStatus } from '../reducers/index';

@Injectable()
export class CanActivateViaAuthGuard  {

  constructor(private store: Store<AppState>) {}

  canActivate() {
    return this.store.select(getUserAuthStatus);
  }
}
