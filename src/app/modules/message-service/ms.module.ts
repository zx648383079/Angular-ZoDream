import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageServiceRoutedComponents, MessageServiceRoutingModule } from './ms-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { MessageServiceService } from './ms.service';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        MessageServiceRoutingModule,
        ZreFormModule,
        DialogModule,
    ],
    declarations: [...MessageServiceRoutedComponents],
    providers: [
        MessageServiceService,
    ]
})
export class MessageServiceModule { }
