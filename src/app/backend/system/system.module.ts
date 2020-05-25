import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule, systemRoutedComponents } from './system-routing.module';
import { ThemeModule } from '../../theme/theme.module';


@NgModule({
  declarations: [...systemRoutedComponents],
  imports: [
    CommonModule,
    ThemeModule,
    SystemRoutingModule
  ]
})
export class SystemModule { }
