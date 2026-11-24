import { User } from './../../../../models/user';
import { Pin } from './../../../../models/pin';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, inject, input } from '@angular/core';
import * as fromRoot from '../../../../reducers';
import * as comment from '../../../../actions/comment';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'pin-pin-comment-new',
    templateUrl: './pin-comment-new.component.html',
    styleUrls: ['./pin-comment-new.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, AsyncPipe]
})
export class PinCommentNewComponent implements OnInit {
  private store = inject<Store<fromRoot.AppState>>(Store);
  private formBuilder = inject(UntypedFormBuilder);

  commentForm: UntypedFormGroup;
  userIsAuthenticated: Observable<boolean>;
  readonly authUser = input.required<User>();
  readonly pin = input.required<Pin>();


  constructor() {
    this.userIsAuthenticated = this.store.select(fromRoot.getUserAuthStatus);
  }

  ngOnInit() {
    this.initCommentForm();
  }

  onCommentSave() {
    const newComment = this.commentForm.value;
    if(this.commentForm.valid){
      this.store.dispatch(new comment.AddCommentAction(newComment));
      this.resetForm();
    }
  }

  initCommentForm(){
    this.commentForm = this.formBuilder.group({
      message: ['', Validators.required],
      user_id: [this.authUser().id, Validators.required],
      pin_id: [this.pin().id, Validators.required]
    });
  }

  onCancel() {
    this.resetForm();
  }

  resetForm() {
    this.initCommentForm();
  }

  onKeyPressed(keyCode){
    if(keyCode === 13){
      this.onCommentSave();
    }
  }

}
