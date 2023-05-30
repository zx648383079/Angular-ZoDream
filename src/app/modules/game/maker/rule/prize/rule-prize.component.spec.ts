/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RulePrizeComponent } from './rule-prize.component';

describe('RulePrizeComponent', () => {
  let component: RulePrizeComponent;
  let fixture: ComponentFixture<RulePrizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulePrizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulePrizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
