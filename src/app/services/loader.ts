import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers/index';
import * as notification from '../actions/notification'
import { PopNotificationAction } from '../actions/notification';
import { Toastr } from '../models/toastr';

@Injectable()
export class LoaderService {
  private store = inject<Store<AppState>>(Store);

  
  showPreloader(){
    this.store.dispatch(new notification.ShowProgressAction());
  }

  hidePreloader(){
    this.store.dispatch(new notification.CompleteProgressAction());
  }

  popError() {
    this.store.dispatch(new PopNotificationAction(new Toastr(
      'error', 'Ouchh !!', 'Something Went Wrong'
    )))
  }
}