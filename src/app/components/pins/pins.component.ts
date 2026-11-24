import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Pin } from '../../models/pin';
import { AuthenticationService } from '../../services/authentication';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as pin from '../../actions/pin';
import { AngularMasonry } from '../../vendor/masonry/masonry';
import { AngularMasonryBrick } from '../../vendor/masonry/brick';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { PinItemComponent } from './pin-item/pin-item.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'pin-items',
    templateUrl: './pins.component.html',
    styleUrls: ['./pins.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AngularMasonry, AngularMasonryBrick, InfiniteScrollDirective, PinItemComponent, RouterOutlet]
})

export class PinsComponent implements OnInit {
  private authService = inject(AuthenticationService);
  private store = inject<Store<fromRoot.AppState>>(Store);

  readonly pins = toSignal(this.store.select(fromRoot.getPins), { initialValue: [] as Pin[] });

  ngOnInit() {
    this.loadPins();
  }

  onScroll() {
    this.loadPins();
  }

  loadPins() {
    this
      .store
      .dispatch(new pin.GetPinsAction());
  }

  createRange(len= 20) {
    let arr = [];
    for (let i = 0; i < len ; i++) {
      arr.push(i);
    }
    return arr;
  }

}
