/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditThreadComponent } from './edit-thread.component';

describe('EditThreadComponent', () => {
  let component: EditThreadComponent;
  let fixture: ComponentFixture<EditThreadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditThreadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
