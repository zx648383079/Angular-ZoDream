import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZreFormModule } from '../../components/form';
import { ThemeModule } from '../../theme/theme.module';
import { ExamEditorComponent, MathMarkComponent, QuestionEditorComponent, QuestionInputComponent, QuestionScoringComponent } from './components';
import { BoolInputComponent } from './components/question-editor/bool-input/bool-input.component';
import { OptionInputComponent } from './components/question-editor/option-input/option-input.component';
import { QuestionChildrenComponent } from './components/question-editor/children/question-children.component';
import { QuestionDialogComponent } from './components/question-editor/dialog/question-dialog.component';
import { DialogModule } from '../../components/dialog';
import { MediaPlayerModule } from '../../components/media-player';


const COMPONENTS = [
    MathMarkComponent,
    ExamEditorComponent,
    QuestionInputComponent,
    QuestionEditorComponent,
    QuestionScoringComponent,
];

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormsModule,
        DialogModule,
        ZreFormModule,
        MediaPlayerModule,
    ],
    declarations: [...COMPONENTS,
        BoolInputComponent,
        OptionInputComponent,
        QuestionChildrenComponent,
        QuestionDialogComponent,
    ],
    exports: [...COMPONENTS],

})
export class ExamCommonModule { }