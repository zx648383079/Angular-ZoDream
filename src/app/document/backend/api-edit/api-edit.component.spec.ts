/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApiEditComponent } from './api-edit.component';

describe('ApiEditComponent', () => {
  let component: ApiEditComponent;
  let fixture: ComponentFixture<ApiEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
