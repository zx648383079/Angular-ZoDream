import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule, authRoutedComponents } from './auth-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { OpenModule } from '../open/open.module';
import { AuthService } from './auth.service';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';


@NgModule({
    declarations: [...authRoutedComponents],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelectModule,
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
