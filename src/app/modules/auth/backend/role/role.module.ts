import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleRoutingModule, roleRoutedComponents } from './role-routing.module';
import { RoleService } from './role.service';
import { ThemeModule } from '../../../../theme/theme.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DesktopModule } from '../../../../components/desktop';
import { FormField } from '@angular/forms/signals';
import { ZreFormModule } from '../../../../components/form';

@NgModule({
    imports: [
        CommonModule,
        DesktopModule,
        ThemeModule,
        FormField,
        ZreFormModule,
        NgSelectModule,
        RoleRoutingModule
    ],
    declarations: [...roleRoutedComponents],
    providers: [
        RoleService,
    ],
})
export class RoleModule { }
