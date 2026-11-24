/* tslint:disable:no-unused-variable */

import { TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { SlimLoadingBarService } from './vendor/slim-loading-bar';
import { ToasterService } from 'angular2-toaster';
import { MockStore } from '../testing/mock-store';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: Store, useClass: MockStore },
        SlimLoadingBarService,
        ToasterService
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
  });

  it('should create the app', waitForAsync(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should show toasts at the bottom right without duplicates', waitForAsync(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app.toasterconfig.positionClass).toEqual('toast-bottom-right');
    expect(app.toasterconfig.preventDuplicates).toBe(true);
  }));

  it('should render the header, the routed page and the footer', waitForAsync(() => {
    let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('header pin-header')).toBeTruthy();
    expect(compiled.querySelector('section.main router-outlet')).toBeTruthy();
    expect(compiled.querySelector('pin-footer')).toBeTruthy();
  }));
});
