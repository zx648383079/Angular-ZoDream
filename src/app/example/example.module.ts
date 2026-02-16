import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../theme/theme.module';
import { ExampleRoutingComponents, ExampleRoutingModule } from './routing.module';
import { ZreEditorModule } from '../components/editor';
import { ZreFormModule } from '../components/form';
import { DialogModule } from '../components/dialog';
import { AuthSharedModule } from '../modules/auth/auth-shared.module';
import { FileExplorerModule } from '../components/file-explorer';
import { MediaPlayerModule } from '../components/media-player';
import { ZreSwiperModule } from '../components/swiper';
import { DesktopModule } from '../components/desktop';
import { TabletModule } from '../components/tablet';
import { ZreChartModule } from '../components/chart';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        TabletModule,
        ZreEditorModule,
        ZreFormModule,
        DialogModule,
        FileExplorerModule,
        MediaPlayerModule,
        FormField,
        AuthSharedModule,
        ExampleRoutingModule,
        ZreSwiperModule,
        ZreChartModule.forChild()
    ],
    declarations: [...ExampleRoutingComponents]
})
export class ExampleModule { }
