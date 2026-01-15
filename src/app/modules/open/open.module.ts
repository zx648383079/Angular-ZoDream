import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { openRoutedComponents, OpenRoutingModule } from './open-routing.module';
import { PlatformOptionComponent } from './platform-option/platform-option.component';
import { OpenService } from './open.service';
import { ZreFormModule } from '../../components/form';
import { DialogModule } from '../../components/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { DesktopModule } from '../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        OpenRoutingModule,
        ZreFormModule,
        DialogModule,
        NgSelectModule,
    ],
    declarations: [...openRoutedComponents, PlatformOptionComponent],
    exports: [PlatformOptionComponent],
    providers: [
        OpenService,
    ]
})
export class OpenModule { }
