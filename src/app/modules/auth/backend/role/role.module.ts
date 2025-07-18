import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleRoutingModule, roleRoutedComponents } from './role-routing.module';
import { RoleService } from './role.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../../theme/theme.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DesktopModule } from '../../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DesktopModule,
        ThemeModule,
        NgSelectModule,
        RoleRoutingModule
    ],
    declarations: [...roleRoutedComponents],
    providers: [
        RoleService,
    ],
})
export class RoleModule { }
