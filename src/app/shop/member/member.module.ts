import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { memberRoutingComponents, MemberRoutingModule } from './member-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { ThemeModule } from '../../theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageContainerModule } from '../../message-container/message-container.module';
import { ZreFormModule } from '../../form';
import { ShopCommonModule } from '../common.module';

@NgModule({
    declarations: [...memberRoutingComponents, UserMenuComponent],
    imports: [
        CommonModule,
        MemberRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        NgbModule,
        LazyLoadImageModule,
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
