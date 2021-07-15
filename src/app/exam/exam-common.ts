import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MathMarkComponent } from './math-mark/math-mark.component';
import { FormsModule } from '@angular/forms';

const COMPONENTS = [
    MathMarkComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],

})
export class ExamCommonModule { }