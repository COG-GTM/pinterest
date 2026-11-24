import { Injectable, inject } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState, getUserAuthStatus } from '../reducers/index';

@Injectable()
export class CanActivateViaAuthGuard  {
  private store = inject<Store<AppState>>(Store);


  canActivate() {
    return this.store.select(getUserAuthStatus);
  }
}
