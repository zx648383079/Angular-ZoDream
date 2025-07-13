import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { microBackendRoutedComponents, MicroBackendRoutingModule } from './micro-routing.module';
import { MicroService } from './micro.service';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        MicroBackendRoutingModule,
    ],
    declarations: [...microBackendRoutedComponents],
    providers: [
        MicroService,
    ]
})
export class MicroModule { }
