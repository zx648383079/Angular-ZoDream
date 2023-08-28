import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownEditorComponent } from './markdown-editor/markdown-editor.component';
import { FormsModule } from '@angular/forms';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { ThemeModule } from '../../theme/theme.module';
import { EditorComponent } from './editor.component';
import { EditorColorComponent } from './modal/color/editor-color.component';
import { EditorImageComponent } from './modal/image/editor-image.component';
import { EditorVideoComponent } from './modal/video/editor-video.component';
import { EditorFileComponent } from './modal/file/editor-file.component';
import { EditorLinkComponent } from './modal/link/editor-link.component';
import { EditorTableComponent } from './modal/table/editor-table.component';
import { ZreFormModule } from '../form';
import { EditorDropdownComponent } from './modal/dropdown/editor-dropdown.component';
import { EditorResizerComponent } from './modal/resizer/editor-resizer.component';
import { EditorCodeComponent } from './modal/code/editor-code.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { EditorSearchComponent } from './modal/search/editor-search.component';
import { MarkdownBlockComponent } from './markdown-block/markdown-block.component';

const COMPONENTS = [
    MarkdownEditorComponent,
    MarkdownBlockComponent,
    TextEditorComponent,
    EditorComponent,
    CodeEditorComponent,
];

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        FormsModule,
    ],
    declarations: [
        ...COMPONENTS,
        EditorColorComponent,
        EditorImageComponent,
        EditorVideoComponent,
        EditorFileComponent,
        EditorLinkComponent,
        EditorTableComponent,
        EditorDropdownComponent,
        EditorResizerComponent,
        EditorCodeComponent,
        EditorSearchComponent,
    ],
    exports: [
        ...COMPONENTS
    ],
})
export class ZreEditorModule { }
