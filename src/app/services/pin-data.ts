import { Injectable, inject } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromPins from '../reducers/pins';
import { Pin } from '../models/pin';
import { Comment } from '../models/comment';
import { environment } from '../../environments/environment';
import { ApiUrl } from '../app.api-url';
import { HttpService } from './http';
import { AppState, getPinscountWithSeatchQuery } from '../reducers/index';
import { Store } from '@ngrx/store';
import { PhoenixChannelService } from './phoenix-channel.service';

@Injectable()
export class PinDataService {
  http = inject(HttpService);
  store = inject<Store<AppState>>(Store);
  private phoenixChannelService = inject(PhoenixChannelService);

  PinState: Observable<fromPins.State>;
  pinsOffset: number = 0;
  searchQuery: string;

  constructor() {
    this.store.select(getPinscountWithSeatchQuery()).subscribe(
      params => {
      this.pinsOffset = params.offset;
      this.searchQuery = params.query;
    });
  };

  getPins(): Observable<Pin[]> {
    let query = `pins?limit=20&offset=${this.pinsOffset}`;

    if(this.searchQuery && this.searchQuery.length) {
      query += `&tags=${this.searchQuery}`
    }

    return this
      .http.get(query).pipe(
        map((res: any) => res.data),
        map(pins => {
        this.pinsOffset += pins.length;
        return pins.map(pin => new Pin(pin));
      })
      )
  }

  getPin(id: string): Observable<Pin> {
    return this
      .http.get(`pins/${id}`).pipe(
        map((res: any) => res.data),
        map(pin => new Pin(pin))
      )
  }

  addPin(pin: Pin): Observable<Pin> {
    return this
      .http.post('pins', {pin: pin}).pipe(
        map((res: any) => res.data),
        map(pin => new Pin(pin))
      );
  }

  savePin(pin: Pin): Observable<Pin> {
    return this
      .http.put(`pins/${pin.id}`, { pin: pin }).pipe(
        map((res: any) => res.data),
        map(pin => new Pin(pin))
      );
  }

  deletePin(id): Observable<string> {
    return this
      .http.delete(`pins/${id}`).pipe(
        map(() => id)
      );
  }

  getComments(pinId: string): Observable<Comment[]> {
    return this
      .http.get(`pins/${pinId}`).pipe(
        map((res: any) => res.data.comments),
        map(comments => comments)
      )
  }

  addComment(comment: Comment): Observable<Comment> {
    return this
      .http.post('comments', {comment: comment}).pipe(
        map((res: any) => res.data),
        map(comment => new Comment(comment))
      );
  }

  deleteComment(id): Observable<string> {
    return this
      .http.delete(`comments/${id}`).pipe(
        map(() => id)
      );
  }
}