import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageServiceRoutedComponents, MessageServiceRoutingModule } from './ms-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageServiceService } from './ms.service';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
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
