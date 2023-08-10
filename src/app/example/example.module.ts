import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../theme/theme.module';
import { ExampleRoutingComponents, ExampleRoutingModule } from './routing.module';
import { ZreEditorModule } from '../components/editor';
import { ZreFormModule } from '../components/form';
import { DialogModule } from '../components/dialog';
import { AuthSharedModule } from '../modules/auth/auth-shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { FileExplorerModule } from '../components/file-explorer';
import { MediaPlayerModule } from '../components/media-player';
import { NgxEchartsModule } from 'ngx-echarts';
import { ZreSwiperModule } from '../components/swiper';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreEditorModule,
        ZreFormModule,
        DialogModule,
        FileExplorerModule,
        NgSelectModule,
        MediaPlayerModule,
        ReactiveFormsModule,
        AuthSharedModule,
        ExampleRoutingModule,
        ZreSwiperModule,
        NgxEchartsModule.forChild()
    ],
    declarations: [...ExampleRoutingComponents]
})
export class ExampleModule { }
