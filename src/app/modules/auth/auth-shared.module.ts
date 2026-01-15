import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPanelComponent } from './login/panel/login-panel.component';
import { LoginDialogComponent } from './login/dialog/login-dialog.component';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';
import { FormField } from '@angular/forms/signals';


const COMPONENTS = [
    LoginPanelComponent,
    LoginDialogComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormField,
        ThemeModule,
        ZreFormModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
})
export class AuthSharedModule { }
