import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, getPinAccessStatus } from '../reducers/index';

export const canEditPinGuard: CanActivateFn = () =>
  inject<Store<AppState>>(Store).select(getPinAccessStatus);
