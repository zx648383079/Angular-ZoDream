import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPanelComponent } from './login/panel/login-panel.component';
import { LoginDialogComponent } from './login/dialog/login-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../theme/theme.module';
import { ZreFormModule } from '../form';


const COMPONENTS = [
    LoginPanelComponent,
    LoginDialogComponent
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ThemeModule,
        ZreFormModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
})
export class AuthSharedModule { }
