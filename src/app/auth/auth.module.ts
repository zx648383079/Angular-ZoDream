import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule, authRoutedComponents } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../theme/theme.module';


@NgModule({
  declarations: [...authRoutedComponents],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    ThemeModule,
  ]
})
export class AuthModule { }
