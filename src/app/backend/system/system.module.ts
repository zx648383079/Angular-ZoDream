import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule, systemRoutedComponents } from './system-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { SystemService } from './system.service';


@NgModule({
  declarations: [...systemRoutedComponents],
  imports: [
    CommonModule,
    ThemeModule,
    SystemRoutingModule
  ],
  providers: [
    SystemService,
  ]
})
export class SystemModule { }
