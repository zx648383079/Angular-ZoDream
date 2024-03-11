import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule, authRoutedComponents } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AuthService } from './auth.service';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { ThemeModule } from '../../../theme/theme.module';
import { OpenModule } from '../../open/open.module';


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
