import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThemeModule } from '../../theme/theme.module';
import { userRoutedComponents, UserRoutingModule } from './user-routing.module';
import { UserService } from './user.service';
import { DialogModule } from '../../components/dialog';
import { ZreFormModule } from '../../components/form';
import { LinkRuleModule } from '../../components/link-rule';
import { DesktopModule } from '../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        Field,
        NgSelectModule,
        ThemeModule,
        DesktopModule,
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
