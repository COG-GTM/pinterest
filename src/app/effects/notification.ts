import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { AppState } from '../reducers/index';
import * as notification from '../actions/notification';
import { Toastr } from '../models/toastr';

@Injectable()
export class NotificationEffects {
  private actions$ = inject<Actions<any>>(Actions);
  private store = inject<Store<AppState>>(Store);


  showProgress$ = createEffect((): Observable<Action> => this.actions$.pipe(
    ofType<any>(notification.ActionTypes.SHOW_PROGRESS),
    map(() => new notification.ShowProgressSuccessAction())
  ));
  
  completeProgress$ = createEffect((): Observable<Action> => this.actions$.pipe(
    ofType<any>(notification.ActionTypes.COMPLETE_PROGRESS),
    map(() => new notification.CompleteProgressSuccessAction())
  ));

  showNotification$ = createEffect((): Observable<Action> => this.actions$.pipe(
    ofType<any>(notification.ActionTypes.POP_NOTIFICATION),
    map(action => action.payload),
    map((toastr: Toastr) => new notification.PopNotificationSuccessAction(toastr))
  ));

}