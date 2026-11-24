import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import * as comment from '../actions/comment';
import * as userAuth from '../actions/user-auth';
import { AppState } from '../reducers/index';
import { PinDataService } from '../services/pin-data';
import { Comment } from '../models/comment';

@Injectable()
export class CommentEffects {
  constructor(
    private actions$: Actions<any>,
    private pinDataService: PinDataService,
    private store: Store<AppState>
  ) {}

  @Effect() loadComments$: Observable<Action> = this.actions$.pipe(
    ofType<any>(comment.ActionTypes.LOAD_COMMENTS),
    map(action => action.payload),
    switchMap((pin_id) => this.pinDataService.getComments(pin_id)),
    filter((comments: Comment[]) => comments.length > 0),
    map((comments) => new comment.LoadCommentsSuccessAction(comments))
  );

  @Effect() addComment$: Observable<Action> = this.actions$.pipe(
    ofType<any>(comment.ActionTypes.ADD_COMMENT),
    map(action => action.payload),
    switchMap((comment: Comment) => this.pinDataService.addComment(comment)),
    map((_comment) => new comment.AddCommentSuccessAction(_comment))
  );

  @Effect() deleteComment$: Observable<Action> = this.actions$.pipe(
    ofType<any>(comment.ActionTypes.DELETE_COMMENT),
    map(action => action.payload),
    switchMap((id: string) => this.pinDataService.deleteComment(id)),
    map((id) => new comment.DeleteCommentSuccessAction(id))
  );
}