import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule, contactRoutedComponents } from './contact-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ContactService } from './contact.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [...contactRoutedComponents],
  imports: [
    CommonModule,
    NgbPaginationModule,
    ThemeModule,
    ContactRoutingModule,
  ],
  providers: [
    ContactService,
  ],
})
export class ContactModule { }
