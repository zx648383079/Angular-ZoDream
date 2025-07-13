import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userRoutedComponents, UserRoutingModule } from './user-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { UserService } from './user.service';
import { ZreFormModule } from '../../components/form';
import { LinkRuleModule } from '../../components/link-rule';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuService } from './menu.service';
import { DialogModule } from '../../components/dialog';
import { MessageContainerModule } from '../../components/message-container';
import { DesktopModule } from '../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ZreFormModule,
        LinkRuleModule,
        DesktopModule,
        ReactiveFormsModule,
        DialogModule,
        FormsModule,
        MessageContainerModule,
        UserRoutingModule
    ],
    declarations: [...userRoutedComponents],
    providers: [
        UserService,
        MenuService,
    ]
})
export class UserModule { }
