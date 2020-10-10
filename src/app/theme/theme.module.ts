import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetPipe, SizePipe, TimestampPipe, AgoPipe, TwoPadPipe, TreeLevelPipe } from './pipes';
import { RouterModule } from '@angular/router';
import { AuthService, TransferStateService, ThemeService, DateAdapter} from './services';
import { AuthActions } from './actions';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  TransferStateInterceptor,
  TokenInterceptor,
  ResponseInterceptor
} from './interceptors';
import { CanActivateViaAuthGuard } from './guards';
import {
  NavBarComponent,
  PageTipComponent,
  BarItemComponent,
  BarUlComponent,
  EditHeaderComponent,
  MediaPlayerComponent,
  ProgressBarComponent,
  PullToRefreshComponent,
  PanelComponent, DatepickerComponent, SwitchComponent, CountDownComponent
} from './components';
import { PasswordValidatorDirective } from './validators';
import { InfiniteScrollDirective } from './directives';
import { FormsModule } from '@angular/forms';
import { FileUploadService } from './services/file-upload.service';

const BASE_MODULES = [
  CommonModule,
  FormsModule,
  RouterModule,
];

const COMPONENTS = [
  NavBarComponent,
  BarItemComponent,
  BarUlComponent,
  PageTipComponent,
  EditHeaderComponent,
  MediaPlayerComponent,
  ProgressBarComponent,
  PullToRefreshComponent,
  PanelComponent,
  DatepickerComponent,
  SwitchComponent,
  CountDownComponent,
];

const PIPES = [
  AssetPipe,
  SizePipe,
  TimestampPipe,
  AgoPipe,
  TwoPadPipe,
  TreeLevelPipe,
];

const SERVICES = [
  AuthService,
  ThemeService,
  FileUploadService,
  DateAdapter,
];

const ACTIONS = [
  AuthActions
];

const DIRECTIVES = [
  PasswordValidatorDirective,
  InfiniteScrollDirective
];

@NgModule({
  imports: [...BASE_MODULES],
  exports: [...BASE_MODULES, ...COMPONENTS, ...PIPES, ...DIRECTIVES],
  declarations: [...COMPONENTS, ...PIPES, ...DIRECTIVES],
  providers: [
    ...SERVICES,
    ...ACTIONS,
    {provide: HTTP_INTERCEPTORS, useClass: TransferStateInterceptor, multi: true},
    TransferStateService,
    CanActivateViaAuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
  ],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule
    };
  }
}

