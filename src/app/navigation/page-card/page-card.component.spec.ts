/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PageCardComponent } from './page-card.component';

describe('PageCardComponent', () => {
  let component: PageCardComponent;
  let fixture: ComponentFixture<PageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
