/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoolInputComponent } from './bool-input.component';

describe('BoolInputComponent', () => {
  let component: BoolInputComponent;
  let fixture: ComponentFixture<BoolInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoolInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoolInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
