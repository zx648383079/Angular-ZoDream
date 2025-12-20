import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPanelComponent } from './login/panel/login-panel.component';
import { LoginDialogComponent } from './login/dialog/login-dialog.component';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';
import { Field } from '@angular/forms/signals';


const COMPONENTS = [
    LoginPanelComponent,
    LoginDialogComponent
];

@NgModule({
    imports: [
        CommonModule,
        Field,
        ThemeModule,
        ZreFormModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
})
export class AuthSharedModule { }
