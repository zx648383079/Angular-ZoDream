import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { examBackendRoutedComponents, ExamBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { ExamService } from './exam.service';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionTypePipe } from './question-type.pipe';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { MaterialTypePipe } from './material-type.pipe';
import { MediaPlayerModule } from '../../../components/media-player';
import { ExamCommonModule } from '../exam-common';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ReactiveFormsModule,
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
