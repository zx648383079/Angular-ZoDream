/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmulateComponent } from './emulate.component';

describe('EmulateComponent', () => {
  let component: EmulateComponent;
  let fixture: ComponentFixture<EmulateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmulateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmulateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
