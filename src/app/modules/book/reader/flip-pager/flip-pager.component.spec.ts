/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlipPagerComponent } from './flip-pager.component';

describe('FlipPagerComponent', () => {
  let component: FlipPagerComponent;
  let fixture: ComponentFixture<FlipPagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlipPagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlipPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
