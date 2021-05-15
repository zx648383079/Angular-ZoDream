/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MarginInputComponent } from './margin-input.component';

describe('MarginInputComponent', () => {
  let component: MarginInputComponent;
  let fixture: ComponentFixture<MarginInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
