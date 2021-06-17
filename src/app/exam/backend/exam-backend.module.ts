import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { examBackendRoutedComponents, ExamBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ExamService } from './exam.service';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionTypePipe } from './question-type.pipe';
import { DialogModule } from '../../dialog';
import { ZreFormModule } from '../../form';
import { MaterialTypePipe } from './material-type.pipe';
import { MediaPlayerModule } from '../../media-player/media-player.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        ExamBackendRoutingModule,
        DialogModule,
        ZreFormModule,
        MediaPlayerModule,
    ],
    declarations: [...examBackendRoutedComponents, QuestionTypePipe, MaterialTypePipe],
    providers: [
        ExamService,
    ]
})
export class ExamBackendModule { }
