import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule, contactRoutedComponents } from './contact-routing.module';


@NgModule({
  declarations: [...contactRoutedComponents],
  imports: [
    CommonModule,
    ContactRoutingModule
  ]
})
export class ContactModule { }
