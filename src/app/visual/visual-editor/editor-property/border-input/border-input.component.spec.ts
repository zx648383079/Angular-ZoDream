/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BorderInputComponent } from './border-input.component';

describe('BorderInputComponent', () => {
  let component: BorderInputComponent;
  let fixture: ComponentFixture<BorderInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorderInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorderInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
