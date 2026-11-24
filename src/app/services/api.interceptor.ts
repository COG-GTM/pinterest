import { inject } from '@angular/core';
import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { LoaderService } from './loader';
import { environment } from '../../environments/environment';

/** Set by HttpService on calls to the Pinwork API; other requests pass through untouched. */
export const API_REQUEST = new HttpContextToken<boolean>(() => false);

/** Prefixes the API endpoint, adds the auth headers unless the caller set its own, and drives the global loader. */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(API_REQUEST)) {
    return next(req);
  }
  const loader = inject(LoaderService);
  const headers = req.headers.keys().length ? req.headers : req.headers
    .set('Authorization', `Basic ${environment.basic_auth_token}`)
    .set('X-Auth-Token', localStorage.getItem('access_token') || '');
  loader.showPreloader();
  return next(req.clone({ url: environment.apiEndpoint + req.url, headers })).pipe(
    tap({ error: () => loader.popError() }),
    finalize(() => loader.hidePreloader())
  );
};
