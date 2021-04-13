import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
    ],
    declarations: [
        MarkdownEditorComponent
    ],
    exports: [
        MarkdownEditorComponent 
    ],
})
export class ZoEditorModule { }
