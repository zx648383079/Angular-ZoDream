import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { userRoutedComponents, UserRoutingModule } from './user-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { UserService } from './user.service';
import { ZreFormModule } from '../../components/form';
import { LinkRuleModule } from '../../components/link-rule';
import { MenuService } from './menu.service';
import { DialogModule } from '../../components/dialog';
import { MessageContainerModule } from '../../components/message-container';
import { DesktopModule } from '../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
    CommonModule,
    ThemeModule,
    FormField,
    ZreFormModule,
    LinkRuleModule,
    DesktopModule,
    DialogModule,
    MessageContainerModule,
    UserRoutingModule,
    NgOptimizedImage
],
    declarations: [...userRoutedComponents],
    providers: [
        UserService,
        MenuService,
    ]
})
export class UserModule { }
