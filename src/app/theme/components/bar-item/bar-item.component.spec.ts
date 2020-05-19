/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BarItemComponent } from './bar-item.component';

describe('BarItemComponent', () => {
  let component: BarItemComponent;
  let fixture: ComponentFixture<BarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
