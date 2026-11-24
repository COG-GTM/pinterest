import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, getUserAuthStatus } from '../reducers/index';

export const authenticatedGuard: CanActivateFn = () =>
  inject<Store<AppState>>(Store).select(getUserAuthStatus);
