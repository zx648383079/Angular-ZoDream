import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generatorRoutedComponents, GeneratorRoutingModule } from './generator-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { DialogModule } from '../../components/dialog';
import { GenerateService } from './generate.service';
import { ZreFormModule } from '../../components/form';
import { DesktopModule } from '../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        DialogModule,
        GeneratorRoutingModule,
        ZreFormModule,
    ],
    declarations: [...generatorRoutedComponents],
    providers: [
        GenerateService,
    ]
})
export class GeneratorModule { }
