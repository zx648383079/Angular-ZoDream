import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule, authRoutedComponents } from './auth-routing.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModule } from 'src/app/theme/theme.module';
import { AccountService } from './account.service';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [...authRoutedComponents],
  imports: [
    CommonModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    ThemeModule,
    AuthRoutingModule
  ],
  providers: [
    AccountService
  ]
})
export class AuthModule { }
