/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PageTipComponent } from './page-tip.component';

describe('PageTipComponent', () => {
  let component: PageTipComponent;
  let fixture: ComponentFixture<PageTipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageTipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
