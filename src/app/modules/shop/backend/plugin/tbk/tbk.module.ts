import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tbkRoutedComponents, TbkRoutingModule } from './tbk-routing.routing';
import { ThemeModule } from '../../../../../theme/theme.module';
import { TbkService } from './tbk.service';
import { ZreFormModule } from '../../../../../components/form';
import { DesktopModule } from '../../../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ZreFormModule,
        TbkRoutingModule
    ],
    declarations: [...tbkRoutedComponents],
    providers: [
        TbkService,
    ],
})
export class TbkModule { }
