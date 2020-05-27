import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiskRoutingModule, diskRoutingComponents } from './disk-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { DiskService } from './disk.service';


@NgModule({
  declarations: [
    ...diskRoutingComponents
  ],
  imports: [
    CommonModule,
    ThemeModule,
    DiskRoutingModule
  ],
  providers: [
    DiskService
  ]
})
export class DiskModule { }
