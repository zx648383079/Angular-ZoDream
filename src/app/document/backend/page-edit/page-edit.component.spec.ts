/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PageEditComponent } from './page-edit.component';

describe('PageEditComponent', () => {
  let component: PageEditComponent;
  let fixture: ComponentFixture<PageEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
