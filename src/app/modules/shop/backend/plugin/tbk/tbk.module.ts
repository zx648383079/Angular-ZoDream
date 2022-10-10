import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tbkRoutedComponents, TbkRoutingModule } from './tbk-routing.routing';
import { ThemeModule } from '../../../../../theme/theme.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TbkService } from './tbk.service';
import { ZreFormModule } from '../../../../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        ZreFormModule,
        TbkRoutingModule
    ],
    declarations: [...tbkRoutedComponents],
    providers: [
        TbkService,
    ],
})
export class TbkModule { }
