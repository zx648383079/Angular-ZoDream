import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiskRoutingModule } from './disk-routing.module';
import { DiskComponent } from './disk.component';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { TrashComponent } from './trash/trash.component';
import { ShareComponent } from './share/share.component';
import { PasswordComponent } from './password/password.component';


@NgModule({
  declarations: [DiskComponent, HomeComponent, CatalogComponent, TrashComponent, ShareComponent, PasswordComponent],
  imports: [
    CommonModule,
    DiskRoutingModule
  ]
})
export class DiskModule { }
