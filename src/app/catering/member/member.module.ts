import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { memberRoutingComponents, MemberRoutingModule } from './member-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MemberRoutingModule,
  ],
  declarations: [...memberRoutingComponents]
})
export class MemberModule { }
