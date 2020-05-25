/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MixComponent } from './mix.component';

describe('MixComponent', () => {
  let component: MixComponent;
  let fixture: ComponentFixture<MixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
