import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetPipe } from './pipes';
import { RouterModule } from '@angular/router';
import { AuthService, TransferStateService, ThemeService} from './services';
import { AuthActions } from './actions';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  TransferStateInterceptor,
  TokenInterceptor,
  ResponseInterceptor
} from './interceptors';
import { CanActivateViaAuthGuard } from './guards';
import { NavBarComponent, PageTipComponent, BarItemComponent, BarUlComponent, EditHeaderComponent } from './components';

const BASE_MODULES = [
  CommonModule,
  RouterModule,
];

const COMPONENTS = [
  NavBarComponent,
  BarItemComponent,
  BarUlComponent,
  PageTipComponent,
  EditHeaderComponent
];

const PIPES = [
  AssetPipe,
];

const SERVICES = [
  AuthService,
  ThemeService,
];

const ACTIONS = [
  AuthActions
];

const DIRECTIVES = [
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
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ThemeModule
    };
  }
}

