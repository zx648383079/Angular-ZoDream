import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackendRoutingModule } from './backend-routing.module';
import { BackendComponent } from './backend.component';
import { ThemeModule } from '../theme/theme.module';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [BackendComponent, HomeComponent],
  imports: [
    CommonModule,
    ThemeModule,
    BackendRoutingModule
  ]
})
export class BackendModule { }
