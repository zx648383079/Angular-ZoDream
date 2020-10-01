import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { smsRoutedComponents, SmsRoutingModule } from './sms-routing.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { OpenModule } from '../open/open.module';
import { SmsService } from './sms.service';

@NgModule({
  imports: [
    CommonModule,
    NgbPaginationModule,
    ThemeModule,
    ReactiveFormsModule,
    SmsRoutingModule,
    OpenModule,
  ],
  declarations: [...smsRoutedComponents],
  providers: [
    SmsService,
  ]
})
export class SmsModule { }
