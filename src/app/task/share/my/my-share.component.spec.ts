/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyShareComponent } from './my-share.component';

describe('MyShareComponent', () => {
  let component: MyShareComponent;
  let fixture: ComponentFixture<MyShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
