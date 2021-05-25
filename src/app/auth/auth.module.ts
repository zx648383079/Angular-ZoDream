import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule, authRoutedComponents } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../theme/theme.module';
import { LoginPanelComponent } from './login-panel/login-panel.component';
import { ZreFormModule } from '../form';


@NgModule({
    declarations: [...authRoutedComponents, LoginPanelComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AuthRoutingModule,
        ThemeModule,
        ZreFormModule,
    ],
    exports: [
        LoginPanelComponent,
    ]
})
export class AuthModule { }
