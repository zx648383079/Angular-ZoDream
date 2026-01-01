import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { PageTipComponent } from './page-tip/page-tip.component';
import { EditHeaderComponent } from './edit-header/edit-header.component';
import { PanelComponent } from './panel/panel.component';
import { CountdownComponent } from './countdown/countdown.component';
import { PaginationComponent } from './pagination/pagination.component';
import { EmojiPickerComponent } from './emoji-picker/emoji-picker.component';
import { EditableTableComponent } from './editable-table/editable-table.component';
import { LoadingRingComponent } from './loading-ring/loading-ring.component';
import { LoadingTipComponent } from './loading-tip/loading-tip.component';
import { ManageDialogComponent } from './manage-dialog/manage-dialog.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { UserPickerComponent } from './user-picker/user-picker.component';
import { ToggleBarComponent } from './toggle-bar/toggle-bar.component';
import { FileInputComponent } from './file-input/file-input.component';
import { FileOnlineComponent } from './file-online/file-online.component';

import {
    AssetPipe,
    SizePipe,
    TimestampPipe,
    AgoPipe,
    TwoPadPipe,
    TreeLevelPipe,
    NumberFormatPipe,
    IconfontPipe
} from './pipes';
import {
    PasswordValidatorDirective,
    FocusNextDirective,
    InfiniteScrollDirective,
    LazyLoadDirective,
    ScrollFixedDirective,
    FileDropDirective,
    DropdownDirective,
    DragDropDirective
} from './directives';
import { RouterModule } from '@angular/router';
import { MarkdownBlockComponent } from './markdown-block/markdown-block.component';
import { MediaPlayerModule } from '../media-player';
import { CodeBlockComponent } from './code-block/code-block.component';
import { Field } from '@angular/forms/signals';
import { ZreFormModule } from '../form';
import { FormPanelComponent } from './form-panel/form-panel.component';
import { ReactiveFormsModule } from '@angular/forms';


const COMPONENTS = [
    NavBarComponent,
    PageTipComponent,
    EditHeaderComponent,
    PanelComponent,
    CountdownComponent,
    EmojiPickerComponent,
    PaginationComponent,
    EditableTableComponent,
    LoadingRingComponent,
    LoadingTipComponent,
    ManageDialogComponent,
    CaptchaComponent,
    UserPickerComponent,
    ToggleBarComponent,
    FileInputComponent,
    FileOnlineComponent,
    MarkdownBlockComponent,
    CodeBlockComponent,
    FormPanelComponent,
];

const PIPES = [
    AssetPipe,
    SizePipe,
    TimestampPipe,
    AgoPipe,
    TwoPadPipe,
    TreeLevelPipe,
    NumberFormatPipe,
    IconfontPipe,
];

const DIRECTIVES = [
    PasswordValidatorDirective,
    InfiniteScrollDirective,
    LazyLoadDirective,
    FileDropDirective,
    FocusNextDirective,
    ScrollFixedDirective,
    DropdownDirective,
    DragDropDirective
];

@NgModule({
    imports: [
        CommonModule,
        ZreFormModule,
        ReactiveFormsModule,
        Field,
        RouterModule,
        MediaPlayerModule
    ],
    exports: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
    declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES]
})
export class DesktopModule { }
