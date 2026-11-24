import './rxjs-operators';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import * as firebase from 'firebase/app';
import { StoreModule, Store } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { UrlRouterStateSerializer } from './router-state-serializer';
import { routes, AppRoutes } from './app.routes';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MasonryModule } from './vendor/masonry';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';
import {SlimLoadingBarModule} from 'ng2-slim-loading-bar';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { AuthenticationService } from './services/authentication';
import { reducers, metaReducers, AppState } from './reducers/index';
import { UserAuthEffects } from './effects/user-auth';
import { PinsComponent } from './components/pins/pins.component';
import { PinItemComponent } from './components/pins/pin-item/pin-item.component';
import { PinEffects } from './effects/pin';
import { PinDataService } from './services/pin-data';
import { PinDetailComponent } from './components/pins/pin-detail/pin-detail.component';
import { ModalComponent } from './components/shared/modal/modal.component';
import { CommentEffects } from './effects/comment';
import { PinEditComponent } from './components/pins/pin-edit/pin-edit.component';
import { HttpService } from './services/http';
import { LoaderService } from './services/loader';
import { NotificationEffects } from './effects/notification';
import { ToasterService, ToasterModule } from 'angular2-toaster';
import { CanActivateViaAuthGuard } from './guards/authenticated';
import { CanEditPinGuard } from './guards/can-edit-pin';
import { PhoenixChannelService } from './services/phoenix-channel.service';
import { PinCommentComponent } from './components/pins/pin-detail/pin-comment/pin-comment.component';
import { PinCommentNewComponent } from './components/pins/pin-detail/pin-comment-new/pin-comment-new.component';

// Must export the config
export const firebaseConfig = {
  apiKey: 'AIzaSyA4tjVj427twh-n3lOAAniS-x9knzdw7vM',
  authDomain: 'pinterest-da3ba.firebaseapp.com',
  databaseURL: 'https://pinterest-da3ba.firebaseio.com',
  storageBucket: 'pinterest-da3ba.appspot.com',
  messagingSenderId: '1047429115771'
};

firebase.initializeApp(firebaseConfig);


// adding rx operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/of';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PinsComponent,
    PinItemComponent,
    PinDetailComponent,
    ModalComponent,
    PinEditComponent,
    PinCommentComponent,
    PinCommentNewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutes,
    RouterModule.forRoot(routes),
    StoreModule.forRoot(reducers, { metaReducers, runtimeChecks: { strictStateImmutability: true, strictActionImmutability: false } }),
    // StoreDevtoolsModule.instrumentOnlyWithExtension(),
    StoreRouterConnectingModule.forRoot({ serializer: UrlRouterStateSerializer }),
    EffectsModule.forRoot([UserAuthEffects, PinEffects, CommentEffects, NotificationEffects]),
    MasonryModule,
    InfiniteScrollModule,
    SlimLoadingBarModule.forRoot(),
    ToasterModule,
    TagInputModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthenticationService,
    PinDataService,
    LoaderService,
    HttpService,
    ToasterService,
    CanActivateViaAuthGuard,
    CanEditPinGuard,
    PhoenixChannelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
