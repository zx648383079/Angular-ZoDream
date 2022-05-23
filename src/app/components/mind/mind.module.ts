import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MindComponent } from './mind.component';
import { ContextMenuModule } from '../context-menu';

const COMPONENTS = [
    MindComponent
];

@NgModule({
    imports: [
        CommonModule,
        ContextMenuModule,
    ],
    declarations: [...COMPONENTS],
    exports: [
        ...COMPONENTS
    ],
})
export class ZreMindModule { }
