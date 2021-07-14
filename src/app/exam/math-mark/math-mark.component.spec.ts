/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MathMarkComponent } from './math-mark.component';

describe('MathMarkComponent', () => {
  let component: MathMarkComponent;
  let fixture: ComponentFixture<MathMarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MathMarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MathMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
