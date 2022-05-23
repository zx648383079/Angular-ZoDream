/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GuaComponent } from './gua.component';

describe('GuaComponent', () => {
  let component: GuaComponent;
  let fixture: ComponentFixture<GuaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
