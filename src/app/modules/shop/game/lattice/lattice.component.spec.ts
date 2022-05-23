/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LatticeComponent } from './lattice.component';

describe('LatticeComponent', () => {
  let component: LatticeComponent;
  let fixture: ComponentFixture<LatticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
