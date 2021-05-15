/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LinkControlComponent } from './link-control.component';

describe('LinkControlComponent', () => {
  let component: LinkControlComponent;
  let fixture: ComponentFixture<LinkControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
