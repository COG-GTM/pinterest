/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { Store } from '@ngrx/store';
import { MockStore } from '../../../../../testing/mock-store';

import { PinCommentComponent } from './pin-comment.component';

describe('PinCommentComponent', () => {
  let component: PinCommentComponent;
  let fixture: ComponentFixture<PinCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinCommentComponent ],
      providers: [ { provide: Store, useClass: MockStore } ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinCommentComponent);
    component = fixture.componentInstance;
    component.authUser = { id: 'u1' };
    component.comment = { id: 'c1', user_id: 'u2', message: 'Hi', inserted_at: '2017-04-01T00:00:00Z', user: { name: 'Grace Hopper', avatar: '' } };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
