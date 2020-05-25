/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditShippingComponent } from './edit.component';

describe('EditShippingComponent', () => {
  let component: EditShippingComponent;
  let fixture: ComponentFixture<EditShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
