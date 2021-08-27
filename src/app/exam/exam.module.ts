import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { examRoutedComponents, ExamRoutingModule } from './exam-routing.module';
import { ThemeModule } from '../theme/theme.module';
import { ExamService } from './exam.service';
import { ZreFormModule } from '../form';
import { ContextMenuModule } from '../context-menu';
import { ExamCommonModule } from './exam-common';
import { DialogModule } from '../dialog';

@NgModule({
    imports: [
        CommonModule,
        ExamRoutingModule,
        ZreFormModule,
        ContextMenuModule,
        ExamCommonModule,
        ThemeModule,
        DialogModule,
    ],
    declarations: [...examRoutedComponents],
    providers: [
        ExamService,
    ],
})
export class ExamModule { }
