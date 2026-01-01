import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemRoutingModule, systemRoutedComponents } from './system-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { SystemService } from './system.service';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { Field } from '@angular/forms/signals';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [...systemRoutedComponents],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        Field,
        ThemeModule,
        DesktopModule,
        SystemRoutingModule,
        DialogModule,
        ZreFormModule,
    ],
    providers: [
        SystemService,
    ]
})
export class SystemModule { }
