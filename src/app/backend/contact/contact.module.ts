import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule, contactRoutedComponents } from './contact-routing.module';
import { ThemeModule } from 'src/app/theme/theme.module';


@NgModule({
  declarations: [...contactRoutedComponents],
  imports: [
    CommonModule,
    ThemeModule,
    ContactRoutingModule
  ]
})
export class ContactModule { }
