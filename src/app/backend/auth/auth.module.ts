import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule, authRoutedComponents } from './auth-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from '../../theme/theme.module';
import { AccountService } from './account.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { OpenModule } from '../open/open.module';


@NgModule({
  declarations: [...authRoutedComponents],
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    ThemeModule,
    AuthRoutingModule,
    OpenModule,
  ],
  providers: [
    AccountService,
  ]
})
export class AuthModule { }
