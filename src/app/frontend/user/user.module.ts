import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userRoutedComponents, UserRoutingModule } from './user-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { UserService } from './user.service';
import { ZreFormModule } from '../../components/form';
import { LinkRuleModule } from '../../components/link-rule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        LinkRuleModule,
        ReactiveFormsModule,
        FormsModule,
        UserRoutingModule
    ],
    declarations: [...userRoutedComponents],
    providers: [
        UserService
    ]
})
export class UserModule { }
