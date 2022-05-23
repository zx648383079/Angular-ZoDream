/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PriceProtectComponent } from './price-protect.component';

describe('PriceProtectComponent', () => {
  let component: PriceProtectComponent;
  let fixture: ComponentFixture<PriceProtectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceProtectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceProtectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
