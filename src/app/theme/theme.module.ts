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
    NumberFormatPipe
} from './pipes';
import {
    RouterModule
} from '@angular/router';
import {
    AuthService,
    TransferStateService,
    ThemeService,
    DateAdapter,
    CookieService,
    FileUploadService,
    DownloadService,
    SearchService
} from './services';
import {
    AuthActions
} from './actions';
import {
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import {
    TransferStateInterceptor,
    TokenInterceptor,
    ResponseInterceptor
} from './interceptors';
import {
    CanActivateViaAuthGuard
} from './guards';
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
    LoadingTipComponent
} from './components';
import {
    PasswordValidatorDirective
} from './validators';
import {
    InfiniteScrollDirective,
    LazyLoadDirective
} from './directives';
import {
    FormsModule
} from '@angular/forms';
import { FileDropDirective } from './directives/file-drop.directive';

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
];

const PIPES = [
    AssetPipe,
    SizePipe,
    TimestampPipe,
    AgoPipe,
    TwoPadPipe,
    TreeLevelPipe,
    NumberFormatPipe,
];

const SERVICES = [
    AuthService,
    DateAdapter,
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
];

@NgModule({
    imports: [...BASE_MODULES],
    exports: [...BASE_MODULES, ...COMPONENTS, ...PIPES, ...DIRECTIVES],
    declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
    providers: [
        ...SERVICES,
        ...ACTIONS,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TransferStateInterceptor,
            multi: true
        },
        TransferStateService,
        CanActivateViaAuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ResponseInterceptor,
            multi: true
        },
    ],
})
export class ThemeModule {
    static forRoot(): ModuleWithProviders<ThemeModule> {
        return {
            ngModule: ThemeModule,
            providers: [
                SearchService,
                ThemeService,
                FileUploadService,
            ]
        };
    }
}
