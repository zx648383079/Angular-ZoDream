/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TurntableComponent } from './turntable.component';

describe('TurntableComponent', () => {
  let component: TurntableComponent;
  let fixture: ComponentFixture<TurntableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurntableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurntableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
