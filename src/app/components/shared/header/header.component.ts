import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {AuthenticationService} from '../../../services/authentication';
import {User} from '../../../models/user';
import {Store} from '@ngrx/store';
import {AppState} from '../../../reducers';
import * as userAuth from '../../../actions/user-auth';
import * as fromRoot from '../../../reducers';
import {LoginSuccessAction} from '../../../actions/user-auth';
import { GetPinsAction, SearchPinAction } from '../../../actions/pin';
import { RouterLink } from '@angular/router';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
    selector: 'pin-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, TagInputModule, FormsModule, NgClass]
})

export class HeaderComponent implements OnInit {
  private authService = inject(AuthenticationService);
  private store = inject<Store<AppState>>(Store);

  title = 'PinWork';
  readonly user = toSignal(this.store.select(fromRoot.getAuthUser));
  readonly userIsAuthenticated = toSignal(this.store.select(fromRoot.getUserAuthStatus));
  items: string[];

  ngOnInit() {
    this
      .store
      .dispatch(new userAuth.CheckAuthAction());
  }

  login(provider: string) {
    this
      .store
      .dispatch(new userAuth.LoginAction(provider));
  }

  logout() {
    this
      .store
      .dispatch(new userAuth.LogoutAction());
  }

  onItemAdded(event) {
    this.items.pop();
    this.items.push(event.value);
    this.onsearch();
  }

  onItemRemoved() {
    this.onsearch();
  }

  onsearch() {
    let search_string = this.items.join(',');
    this.store.dispatch(new SearchPinAction(search_string));
    this.store.dispatch(new GetPinsAction(search_string));
  }

}
