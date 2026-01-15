import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tvRoutedComponents, TvRoutingModule } from './tv-routing.module';
import { TvService } from './tv.service';
import { ThemeModule } from '../../theme/theme.module';
import { ZreFormModule } from '../../components/form';
import { ProgressModule } from '../../components/progress';
import { MediaPlayerModule } from '../../components/media-player';
import { DesktopModule } from '../../components/desktop';
import { TabletModule } from '../../components/tablet';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        TabletModule,
        ProgressModule,
        ZreFormModule,
        MediaPlayerModule,
        TvRoutingModule,
    ],
    declarations: [...tvRoutedComponents],
    providers: [
        TvService
    ]
})
export class TvModule { }
