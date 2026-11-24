import { Store } from '@ngrx/store';
import { Component, OnInit, inject, input } from '@angular/core';
import * as fromRoot from '../../../../reducers';
import * as comment from '../../../../actions/comment';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'pin-pin-comment',
    templateUrl: './pin-comment.component.html',
    styleUrls: ['./pin-comment.component.scss'],
    imports: [DatePipe]
})
export class PinCommentComponent implements OnInit {
  private store = inject<Store<fromRoot.AppState>>(Store);

  readonly comment = input.required<any>();
  readonly authUser = input.required<any>();

  ngOnInit() {
  }

  onCommentDelete(id) {
    this.store.dispatch(new comment.DeleteCommentAction(id));
  }

}
