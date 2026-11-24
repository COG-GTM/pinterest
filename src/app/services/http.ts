import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_REQUEST } from './api.interceptor';

export interface RequestOptionsArgs {
  headers?: HttpHeaders;
}

/** Pinwork API client: relative URLs, parsed JSON bodies; apiInterceptor adds endpoint, auth headers and loader. */
@Injectable()
export class HttpService {
  private http = inject(HttpClient);

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http.get(url, this.apiOptions(options));
  }

  getLocal(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http.get(url, options);
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.http.post(url, body, this.apiOptions(options));
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    return this.http.put(url, body, this.apiOptions(options));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http.delete(url, this.apiOptions(options));
  }

  private apiOptions(options?: RequestOptionsArgs) {
    return { ...options, context: new HttpContext().set(API_REQUEST, true) };
  }
}
