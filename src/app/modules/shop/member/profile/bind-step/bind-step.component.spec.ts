/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BindStepComponent } from './bind-step.component';

describe('BindStepComponent', () => {
  let component: BindStepComponent;
  let fixture: ComponentFixture<BindStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
