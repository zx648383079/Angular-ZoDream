/// <reference types="@angular/localize" />

import { enableProdMode } from '@angular/core';
import {platformBrowser, provideProtractorTestingSupport} from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

platformBrowser().bootstrapModule(AppModule, {providers: [provideProtractorTestingSupport()]}).catch(err => console.error(err));
