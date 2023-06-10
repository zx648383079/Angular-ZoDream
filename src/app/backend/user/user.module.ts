import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThemeModule } from '../../theme/theme.module';
import { userRoutedComponents, UserRoutingModule } from './user-routing.module';
import { UserService } from './user.service';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { LinkRuleModule } from '../../components/link-rule';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgSelectModule,
        ThemeModule,
        UserRoutingModule,
        DialogModule,
        ZreFormModule,
        LinkRuleModule,
    ],
    declarations: [...userRoutedComponents],
    providers: [
        UserService
    ]
})
export class UserModule { }
