import {
    NgModule,
    ModuleWithProviders
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
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
    RouterModule
} from '@angular/router';
import {
    AuthService,
    TransferStateService,
    ThemeService,
    CookieService,
    FileUploadService,
    DownloadService,
    SearchService,
    WebAuthn
} from './services';
import {
    AuthActions
} from './actions';
import {
    NavBarComponent,
    PageTipComponent,
    EditHeaderComponent,
    PullToRefreshComponent,
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
    ToggleBarComponent
} from './components';
import {
    PasswordValidatorDirective
} from './validators';
import {
    FocusNextDirective,
    InfiniteScrollDirective,
    LazyLoadDirective,
    ScrollFixedDirective,
    FileDropDirective,
    DropdownDirective,
    DragDropDirective
} from './directives';
import {
    FormsModule
} from '@angular/forms';
import { EncryptorService } from './services/encryptor.service';

const BASE_MODULES = [
    CommonModule,
    FormsModule,
    RouterModule,
];

const COMPONENTS = [
    NavBarComponent,
    PageTipComponent,
    EditHeaderComponent,
    PullToRefreshComponent,
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

const SERVICES = [
    TransferStateService,
    CookieService,
    DownloadService,
];

const ACTIONS = [
    AuthActions,
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
    imports: [...BASE_MODULES],
    exports: [...BASE_MODULES, ...COMPONENTS, ...PIPES, ...DIRECTIVES],
    declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
    providers: [
        ...SERVICES,
        ...ACTIONS,
    ]
})
export class ThemeModule {
    static forRoot(): ModuleWithProviders<ThemeModule> {
        return {
            ngModule: ThemeModule,
            providers: [
                SearchService,
                ThemeService,
                AuthService,
                FileUploadService,
                EncryptorService,
                WebAuthn,
            ]
        };
    }
}
