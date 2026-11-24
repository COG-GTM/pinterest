import { Component, OnInit, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { Pin } from '../../../models/pin';
import { User } from '../../../models/user';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AsyncPipe, UpperCasePipe } from '@angular/common';

declare var $:any;
declare var Foundation:any;

@Component({
    selector: 'pin-pin-item',
    templateUrl: './pin-item.component.html',
    styleUrls: ['./pin-item.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, AsyncPipe, UpperCasePipe]
})
export class PinItemComponent implements OnInit {
  private store = inject<Store<fromRoot.AppState>>(Store);

  readonly pin = input<Pin>();
  user: Observable<User>;

  ngOnInit() {
    this.user = this.store.select(fromRoot.getUserById(this.pin()?.user_id))
  }

  onClick() {
    try{
      setTimeout(() => {
        let el = $('.pinModal-' + this.pin().id);
        if (el.length) {
          if (el.data('zfPlugin')) {
            el.foundation('open');
          }else{
            new Foundation.Reveal(el);
            el.foundation('open');
          }
        }
      }, 100);
    }catch(e){console.log('.pinModal-' + this.pin().id + e)};
  }

}
