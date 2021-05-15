import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { examBackendRoutedComponents, ExamBackendRoutingModule } from './backend-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ExamService } from './exam.service';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionTypePipe } from './question-type.pipe';
import { DialogModule } from '../../dialog';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        ExamBackendRoutingModule,
        DialogModule,
    ],
    declarations: [...examBackendRoutedComponents, QuestionTypePipe],
    providers: [
        ExamService,
    ]
})
export class ExamBackendModule { }
