/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApiFieldTrComponent } from './api-field-tr.component';

describe('ApiFieldTrComponent', () => {
  let component: ApiFieldTrComponent;
  let fixture: ComponentFixture<ApiFieldTrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiFieldTrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiFieldTrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
