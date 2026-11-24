import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpService } from './http';
import { LoaderService } from './loader';
import { apiInterceptor } from './api.interceptor';
import { environment } from '../../environments/environment';

describe('apiInterceptor', () => {
  let loader: jasmine.SpyObj<LoaderService>;
  let backend: HttpTestingController;

  beforeEach(() => {
    loader = jasmine.createSpyObj('LoaderService', ['showPreloader', 'hidePreloader', 'popError']);
    TestBed.configureTestingModule({
      providers: [
        HttpService,
        { provide: LoaderService, useValue: loader },
        provideHttpClient(withInterceptors([apiInterceptor])),
        provideHttpClientTesting()
      ]
    });
    backend = TestBed.inject(HttpTestingController);
  });

  it('prefixes the API endpoint, adds auth headers and drives the loader for API calls', () => {
    TestBed.inject(HttpService).get('pins').subscribe();
    const req = backend.expectOne(environment.apiEndpoint + 'pins');
    expect(req.request.headers.get('Authorization')).toBe(`Basic ${environment.basic_auth_token}`);
    expect(req.request.headers.has('X-Auth-Token')).toBe(true);
    expect(loader.showPreloader).toHaveBeenCalled();
    req.flush({ data: [] });
    expect(loader.hidePreloader).toHaveBeenCalled();
    expect(loader.popError).not.toHaveBeenCalled();
  });

  it('pops an error toast when an API call fails', () => {
    TestBed.inject(HttpService).delete('pins/1').subscribe({ error: () => {} });
    backend.expectOne(environment.apiEndpoint + 'pins/1').flush(null, { status: 500, statusText: 'Server Error' });
    expect(loader.popError).toHaveBeenCalled();
    expect(loader.hidePreloader).toHaveBeenCalled();
  });

  it('leaves non-API requests untouched', () => {
    TestBed.inject(HttpClient).get('assets/x.json').subscribe();
    const req = backend.expectOne('assets/x.json');
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(loader.showPreloader).not.toHaveBeenCalled();
    req.flush({});
  });
});
