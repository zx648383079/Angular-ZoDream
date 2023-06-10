import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { smsRoutedComponents, SmsRoutingModule } from './sms-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { OpenModule } from '../open/open.module';
import { SmsService } from './sms.service';
import { DialogModule } from '../../components/dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        SmsRoutingModule,
        OpenModule,
        DialogModule,
    ],
    declarations: [...smsRoutedComponents],
    providers: [
        SmsService,
    ]
})
export class SmsModule { }
