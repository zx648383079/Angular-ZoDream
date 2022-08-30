/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SpiderComponent } from './spider.component';

describe('SpiderComponent', () => {
  let component: SpiderComponent;
  let fixture: ComponentFixture<SpiderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpiderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
