/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DataSizeComponent } from './data-size.component';

describe('DataSizeComponent', () => {
  let component: DataSizeComponent;
  let fixture: ComponentFixture<DataSizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
