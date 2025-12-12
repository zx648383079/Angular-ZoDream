import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule, authRoutedComponents } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { Field } from '@angular/forms/signals';


@NgModule({
    declarations: [...authRoutedComponents],
    imports: [
        CommonModule,
        DesktopModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        ThemeModule,
        ZreFormModule,
        Field,
    ],
})
export class AuthModule { }
