import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackendRoutingModule } from './backend-routing.module';
import { BackendComponent } from './backend.component';
import { ThemeModule } from '../theme/theme.module';


@NgModule({
  declarations: [BackendComponent],
  imports: [
    CommonModule,
    ThemeModule,
    BackendRoutingModule
  ]
})
export class BackendModule { }
