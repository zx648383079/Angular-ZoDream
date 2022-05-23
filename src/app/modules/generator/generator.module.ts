import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generatorRoutedComponents, GeneratorRoutingModule } from './generator-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { DialogModule } from '../../components/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { GenerateService } from './generate.service';
import { ZreFormModule } from '../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        GeneratorRoutingModule,
        NgSelectModule,
        ZreFormModule,
    ],
    declarations: [...generatorRoutedComponents],
    providers: [
        GenerateService,
    ]
})
export class GeneratorModule { }
