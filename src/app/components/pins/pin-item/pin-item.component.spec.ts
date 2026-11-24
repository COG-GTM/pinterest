/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { MockStore } from '../../../../testing/mock-store';

import { PinItemComponent } from './pin-item.component';

describe('PinItemComponent', () => {
  let component: PinItemComponent;
  let fixture: ComponentFixture<PinItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule, PinItemComponent],
    providers: [{ provide: Store, useClass: MockStore }],
    schemas: [NO_ERRORS_SCHEMA]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
