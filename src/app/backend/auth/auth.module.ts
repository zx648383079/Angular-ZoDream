import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule, authRoutedComponents } from './auth-routing.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [...authRoutedComponents],
  imports: [
    CommonModule,
    NgbPaginationModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
