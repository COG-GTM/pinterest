import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiUrl } from '../app.api-url';
import { HttpService } from './http';

@Injectable()
export class AuthenticationService {
  userAuth: Observable<any>;

  constructor(
    public http: HttpService,
    private zone: NgZone,
  ) {
    const authState = new Observable<firebase.User>(observer =>
      firebase.auth().onAuthStateChanged(
        user => this.zone.run(() => observer.next(user)),
        error => this.zone.run(() => observer.error(error))
      )
    );
    this.userAuth = authState.pipe(
      map(user => this._changeState(user))
    );
  };

  login(from: string) {
    firebase.auth().signInWithPopup(this._getProvider(from)).catch(error => console.trace(error));
    return this.userAuth
  }

  logout() {
    firebase.auth().signOut();
    localStorage.removeItem('access_token')
    return this.userAuth;
  }

  authStatus() {
    return this.userAuth;
  }

  findbyIds(ids: string[]) {
    return  this.http.get('users').pipe(
      map((res: any) => res.data),
      map(users => users.filter(user => ids.indexOf(user.id) > -1)),
      map(users => users.map(user => new User(user)))
    )
  }

  findbyUID(id: string){
    return this.http.get(`users/${id}`).pipe(
      map((res: any) => res.data)
    )
  }

  getAccessToken(userAuth) {
    return this.http.post("users/auth", userAuth).pipe(
      map((res: any) => res),
      map(data => {
        let token = data.token;
        localStorage.setItem('access_token', token);

        return Object.assign(userAuth, {
          access_token: token,
          user: data.user
        })
      })
    )
  }

  updateUserAuth(userAuth) {
    let user = userAuth.user;

    return this.findbyUID(user.id).pipe(
      map(user => {
        return Object.assign({}, userAuth, {
          user: new User(user)
        });
      })
    )
  }

  private _changeState(user: any = null) {
    if(user) {
      return {
        user: this._getUserInfo(user),
        isAuthenticated: true
      }
    }
    else {
      return {
        user: null,
        isAuthenticated: false
      }
    }
  }

  private _getUserInfo(user: any): any {
    if(!user) {
      return {};
    }
    let data = user.providerData[0];
    return {
      name: data.displayName,
      avatar: data.photoURL,
      email: data.email,
      provider: data.providerId,
      uid: user.uid
    };
  }

  private _getProvider(from: string) {
    switch(from){
      case 'twitter': return new firebase.auth.TwitterAuthProvider();
      case 'facebook': return new firebase.auth.FacebookAuthProvider();
      case 'github': return new firebase.auth.GithubAuthProvider();
      case 'google': return new firebase.auth.GoogleAuthProvider();
    }
  }
}