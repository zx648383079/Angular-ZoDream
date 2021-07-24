/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OptionInputComponent } from './option-input.component';

describe('OptionInputComponent', () => {
  let component: OptionInputComponent;
  let fixture: ComponentFixture<OptionInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
