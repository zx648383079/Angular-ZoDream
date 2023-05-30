/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RuleRanchComponent } from './rule-ranch.component';

describe('RuleRanchComponent', () => {
  let component: RuleRanchComponent;
  let fixture: ComponentFixture<RuleRanchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuleRanchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleRanchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
