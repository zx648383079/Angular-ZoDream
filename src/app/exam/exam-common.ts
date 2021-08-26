import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathMarkComponent } from './math-mark/math-mark.component';
import { FormsModule } from '@angular/forms';
import { ExamEditorComponent } from './exam-editor/exam-editor.component';
import { QuestionInputComponent } from './question/input/question-input.component';
import { ZreFormModule } from '../form';
import { ThemeModule } from '../theme/theme.module';

const COMPONENTS = [
    MathMarkComponent,
    ExamEditorComponent,
    QuestionInputComponent,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ZreFormModule,
        ThemeModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],

})
export class ExamCommonModule { }