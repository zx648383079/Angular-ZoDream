/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TbkComponent } from './tbk.component';

describe('TbkComponent', () => {
  let component: TbkComponent;
  let fixture: ComponentFixture<TbkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TbkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TbkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
