import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { memberRoutingComponents, MemberRoutingModule } from './member-routing.module';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { ThemeModule } from '../../../theme/theme.module';
import { MessageContainerModule } from '../../../components/message-container';
import { ZreFormModule } from '../../../components/form';
import { ShopCommonModule } from '../common.module';
import { DesktopModule } from '../../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    declarations: [...memberRoutingComponents, UserMenuComponent],
    imports: [
        CommonModule,
        Field,
        MemberRoutingModule,
        ThemeModule,
        DesktopModule,
        MessageContainerModule,
        ZreFormModule,
        ShopCommonModule,
    ],
    exports: [
        UserMenuComponent,
    ]
})
export class MemberModule { }
