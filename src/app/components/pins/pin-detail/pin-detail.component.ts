import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Pin } from '../../../models/pin';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import * as pin from '../../../actions/pin';
import * as comment from '../../../actions/comment';
import { User } from '../../../models/user';
import { Comment } from '../../../models/comment';
import { UntypedFormBuilder } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';
import { PinCommentComponent } from './pin-comment/pin-comment.component';
import { PinCommentNewComponent } from './pin-comment-new/pin-comment-new.component';

declare var $: any;
declare var Foundation: any;

@Component({
    selector: 'pin-pin-detail',
    templateUrl: './pin-detail.component.html',
    styleUrls: ['./pin-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('flyInRight', [
            state('in', style({ transform: 'translateX(0)', 'z-index': 0 })),
            transition('void => *', [
                style({ transform: 'translateX(-50%)', opacity: 0, 'z-index': -999 }),
                animate(500)
            ])
        ]),
        trigger('flyInDown', [
            state('in', style({ transform: 'translateY(0)', 'z-index': 0 })),
            transition('void => *', [
                style({ transform: 'translateY(100%)', opacity: 0, 'z-index': -999 }),
                animate(500)
            ])
        ])
    ],
    imports: [ModalComponent, PinCommentComponent, PinCommentNewComponent]
})
export class PinDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject<Store<fromRoot.AppState>>(Store);
  private formBuilder = inject(UntypedFormBuilder);

  subscription: Subscription;
  pinIndex: string;
  private pin$: Observable<Pin> = this.store.select(fromRoot.getSelectedPin);
  readonly pin = toSignal(this.pin$);
  readonly comments = toSignal(this.store.select(fromRoot.getSelectedPinComments), { initialValue: [] as Comment[] });
  readonly authUser = toSignal(this.store.select(fromRoot.getAuthUser));
  readonly canAccessPin = toSignal(this.store.select(fromRoot.getPinAccessStatus));

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.pinIndex = params['id'];
        this.store.dispatch(new pin.SelectPinAction(this.pinIndex));

        // Incase Pin is not in store. Load it from api.
        setTimeout(() => this.store.dispatch(new pin.GetSelectedPinAction(this.pinIndex)), 3000);

        this.store.dispatch(new comment.LoadCommentsAction(this.pinIndex));
      }
    );
    this.loadModal();
  }

  loadModal() {
    this.pin$.subscribe(
      pin => {
        try {
          let el = $(`.pinModal-${this.pinIndex}`);
          if (el.length) {
            if (el.data('zfPlugin')) {
              el.foundation('open');
            } else {
              new Foundation.Reveal(el);
              el.foundation('open');
            }
          }
        } catch (e) { console.log(e); };
      }
    );
  }

  onCommentDelete(id) {
    this.store.dispatch(new comment.DeleteCommentAction(id));
  }

  onOnDestroy() {
    this.subscription.unsubscribe();
  }

  getUser(id) {
    return this.store.select(fromRoot.getUserById(id));
  }

  onEditPin() {
    this.router.navigateByUrl(`/pins/${this.pinIndex}/edit`);
  }

}
