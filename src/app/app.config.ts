import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import firebase from 'firebase/compat/app';

import { routes } from './app.routes';
import { reducers, metaReducers } from './reducers/index';
import { UrlRouterStateSerializer } from './router-state-serializer';
import { UserAuthEffects } from './effects/user-auth';
import { PinEffects } from './effects/pin';
import { CommentEffects } from './effects/comment';
import { NotificationEffects } from './effects/notification';
import { AuthenticationService } from './services/authentication';
import { PinDataService } from './services/pin-data';
import { LoaderService } from './services/loader';
import { HttpService } from './services/http';
import { PhoenixChannelService } from './services/phoenix-channel.service';
import { CanActivateViaAuthGuard } from './guards/authenticated';
import { CanEditPinGuard } from './guards/can-edit-pin';
import { SlimLoadingBarService } from './vendor/slim-loading-bar';
import { ToasterService } from './vendor/toaster';

export const firebaseConfig = {
  apiKey: 'AIzaSyA4tjVj427twh-n3lOAAniS-x9knzdw7vM',
  authDomain: 'pinterest-da3ba.firebaseapp.com',
  databaseURL: 'https://pinterest-da3ba.firebaseio.com',
  storageBucket: 'pinterest-da3ba.appspot.com',
  messagingSenderId: '1047429115771'
};

firebase.initializeApp(firebaseConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideStore(reducers, {
      metaReducers,
      runtimeChecks: { strictStateImmutability: true, strictActionImmutability: false }
    }),
    provideRouterStore({ serializer: UrlRouterStateSerializer }),
    provideEffects(UserAuthEffects, PinEffects, CommentEffects, NotificationEffects),
    AuthenticationService,
    PinDataService,
    LoaderService,
    HttpService,
    PhoenixChannelService,
    CanActivateViaAuthGuard,
    CanEditPinGuard,
    SlimLoadingBarService,
    ToasterService
  ]
};
