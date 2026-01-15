import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { examRoutedComponents, ExamRoutingModule } from './exam-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { ExamService } from './exam.service';
import { ZreFormModule } from '../../components/form';
import { ContextMenuModule } from '../../components/context-menu';
import { ExamCommonModule } from './exam-common';
import { DialogModule } from '../../components/dialog';
import { DesktopModule } from '../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        FormField,
        ExamRoutingModule,
        ZreFormModule,
        DesktopModule,
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
