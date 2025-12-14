import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { examBackendRoutedComponents, ExamBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ExamService } from './exam.service';
import { QuestionTypePipe } from './question-type.pipe';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { MaterialTypePipe } from './material-type.pipe';
import { MediaPlayerModule } from '../../../components/media-player';
import { ExamCommonModule } from '../exam-common';
import { DesktopModule } from '../../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DesktopModule,
        ExamBackendRoutingModule,
        DialogModule,
        ZreFormModule,
        MediaPlayerModule,
        ExamCommonModule,
    ],
    declarations: [...examBackendRoutedComponents, QuestionTypePipe, MaterialTypePipe],
    providers: [
        ExamService,
    ]
})
export class ExamBackendModule { }
