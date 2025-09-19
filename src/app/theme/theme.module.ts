import {
    NgModule,
    ModuleWithProviders
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';

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
    FormsModule
} from '@angular/forms';
import { EncryptorService } from './services/encryptor.service';
import { KeepAliveService } from './services/keep-alive.service';

const BASE_MODULES = [
    CommonModule,
    FormsModule,
    RouterModule,
];

const SERVICES = [
    TransferStateService,
    CookieService,
    DownloadService,
];

const ACTIONS = [
    AuthActions,
];



@NgModule({
    imports: [...BASE_MODULES],
    exports: [...BASE_MODULES ],
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
                KeepAliveService,
                AuthService,
                FileUploadService,
                EncryptorService,
                WebAuthn,
            ]
        };
    }
}
