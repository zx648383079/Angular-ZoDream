import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

const COMPONENTS = [
    ProgressBarComponent
];

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [...COMPONENTS],
    exports: [
        ...COMPONENTS,
    ]
})
export class ProgressModule { }
