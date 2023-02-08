/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EquityCardComponent } from './equity-card.component';

describe('EquityCardComponent', () => {
  let component: EquityCardComponent;
  let fixture: ComponentFixture<EquityCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
