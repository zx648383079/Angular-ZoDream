import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MicroRoutingModule } from './micro-routing.module';
import { MicroComponent } from './micro.component';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [MicroComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbPaginationModule,
    MicroRoutingModule
  ]
})
export class MicroModule { }
