import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoaderService } from './loader';
import { environment } from '../../environments/environment';

export interface RequestOptionsArgs {
  headers?: HttpHeaders;
}

/**
 * API client: prefixes the API endpoint, adds the auth headers and drives the global loader.
 * Responses are the parsed JSON body.
 */
@Injectable()
export class HttpService {

  constructor(
    private http: HttpClient,
    public loaderService: LoaderService
  ) {}

  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    this.requestInterceptor();
    return this.track(this.http.get(this.getFullUrl(url), this.requestOptions(options)));
  }

  getLocal(url: string, options?: RequestOptionsArgs): Observable<any> {
    return this.http.get(url, options);
  }

  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    this.requestInterceptor();
    return this.track(this.http.post(this.getFullUrl(url), body, this.requestOptions(options)));
  }

  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    this.requestInterceptor();
    return this.track(this.http.put(this.getFullUrl(url), body, this.requestOptions(options)));
  }

  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    this.requestInterceptor();
    return this.track(this.http.delete(this.getFullUrl(url), this.requestOptions(options)));
  }

  private track(request: Observable<any>): Observable<any> {
    return request.pipe(
      tap(() => {}, () => this.onSubscribeError()),
      finalize(() => this.onFinally())
    );
  }

  private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    options = options || {};
    if (options.headers == null) {
      options.headers = new HttpHeaders({
        'Authorization': `Basic ${environment.basic_auth_token}`,
        'X-Auth-Token': localStorage.getItem('access_token') || ''
      });
    }
    return options;
  }

  private getFullUrl(url: string): string {
    return environment.apiEndpoint + url;
  }

  private requestInterceptor(): void {
    this.loaderService.showPreloader();
  }

  private responseInterceptor(): void {
    this.loaderService.hidePreloader();
  }

  private onSubscribeError(): void {
    this.loaderService.popError();
  }

  private onFinally(): void {
    this.responseInterceptor();
  }
}
