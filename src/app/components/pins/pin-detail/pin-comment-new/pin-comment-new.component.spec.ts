/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore } from '../../../../../testing/mock-store';

import { PinCommentNewComponent } from './pin-comment-new.component';

describe('PinCommentNewComponent', () => {
  let component: PinCommentNewComponent;
  let fixture: ComponentFixture<PinCommentNewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PinCommentNewComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [ { provide: Store, useClass: MockStore } ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinCommentNewComponent);
    component = fixture.componentInstance;
    component.authUser = <any>{ id: 'u1', avatar: '' };
    component.pin = <any>{ id: 'p1' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
