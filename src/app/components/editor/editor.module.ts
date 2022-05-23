import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { FormsModule } from '@angular/forms';
import { TextEditorComponent } from './text-editor/text-editor.component';

const COMPONENTS = [
    MarkdownEditorComponent,
    TextEditorComponent,
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        ...COMPONENTS
    ],
    exports: [
        ...COMPONENTS
    ],
})
export class ZreEditorModule { }
