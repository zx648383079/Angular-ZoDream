import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { examRoutedComponents, ExamRoutingModule } from './exam-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { ExamService } from './exam.service';
import { ZreFormModule } from '../form';
import { ContextMenuModule } from '../context-menu';
import { MediaPlayerModule } from '../media-player/media-player.module';
import { ExamCommonModule } from './exam-common';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ExamRoutingModule,
        ZreFormModule,
        ContextMenuModule,
        MediaPlayerModule,
        ExamCommonModule,
    ],
    declarations: [...examRoutedComponents],
    providers: [
        ExamService,
    ],
})
export class ExamModule { }
