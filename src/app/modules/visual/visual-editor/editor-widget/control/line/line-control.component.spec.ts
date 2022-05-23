/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LineControlComponent } from './line-control.component';

describe('LineControlComponent', () => {
  let component: LineControlComponent;
  let fixture: ComponentFixture<LineControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
