import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MicroRoutingModule } from './micro-routing.module';
import { MicroComponent } from './micro.component';
import { NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MicroService } from './micro.service';


@NgModule({
  declarations: [MicroComponent],
  imports: [
    CommonModule,
    NgbDropdownModule,
    NgbPaginationModule,
    MicroRoutingModule
  ],
  providers: [
    MicroService
  ]
})
export class MicroModule { }
