/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditContentComponent } from './edit-content.component';

describe('EditContentComponent', () => {
  let component: EditContentComponent;
  let fixture: ComponentFixture<EditContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
