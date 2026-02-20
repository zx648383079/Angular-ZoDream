import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule, authRoutedComponents } from './auth-routing.module';
import { AuthService } from './auth.service';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { ThemeModule } from '../../../theme/theme.module';
import { OpenModule } from '../../open/open.module';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';


@NgModule({
    declarations: [...authRoutedComponents],
    imports: [
        CommonModule,
        DesktopModule,
        FormField,
        ThemeModule,
        AuthRoutingModule,
        OpenModule,
        DialogModule,
        ZreFormModule,
    ],
    providers: [
        AuthService,
    ]
})
export class AuthModule { }
