import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { FormsModule } from '@angular/forms';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { HtmlEditorComponent } from './html-editor/html-editor.component';
import { ThemeModule } from '../../theme/theme.module';
import { EditorModule } from '@tinymce/tinymce-angular';

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

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        EditorModule,
        FormsModule,
    ],
    declarations: [
        HtmlEditorComponent
    ],
    exports: [
        HtmlEditorComponent
    ],
})
export class ZreHtmlEditorModule { }
