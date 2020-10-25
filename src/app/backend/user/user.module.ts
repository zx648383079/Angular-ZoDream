import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThemeModule } from '../../theme/theme.module';
import { userRoutedComponents, UserRoutingModule } from './user-routing.module';
import { UserService } from './user.service';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    ThemeModule,
    UserRoutingModule,
  ],
  declarations: [...userRoutedComponents],
  providers: [
    UserService
  ]
})
export class UserModule { }
