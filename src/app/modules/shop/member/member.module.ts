import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { memberRoutingComponents, MemberRoutingModule } from './member-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { ThemeModule } from '../../../theme/theme.module';
import { MessageContainerModule } from '../../../components/message-container';
import { ZreFormModule } from '../../../components/form';
import { ShopCommonModule } from '../common.module';

@NgModule({
    declarations: [...memberRoutingComponents, UserMenuComponent],
    imports: [
        CommonModule,
        MemberRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        ThemeModule,
        MessageContainerModule,
        ZreFormModule,
        ShopCommonModule,
    ],
    exports: [
        UserMenuComponent,
    ]
})
export class MemberModule { }
