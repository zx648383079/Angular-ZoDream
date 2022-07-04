import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tvRoutedComponents, TvRoutingModule } from './tv-routing.module';
import { TvService } from './tv.service';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';
import { ProgressModule } from '../../components/progress';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ProgressModule,
        ZreFormModule,
        TvRoutingModule,
    ],
    declarations: [...tvRoutedComponents],
    providers: [
        TvService
    ]
})
export class TvModule { }
