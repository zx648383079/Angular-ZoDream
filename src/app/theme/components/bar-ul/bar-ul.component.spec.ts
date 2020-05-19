/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BarUlComponent } from './bar-ul.component';

describe('BarUlComponent', () => {
  let component: BarUlComponent;
  let fixture: ComponentFixture<BarUlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarUlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarUlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
