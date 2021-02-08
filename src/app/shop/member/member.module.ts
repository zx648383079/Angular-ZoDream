import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { memberRoutingComponents, MemberRoutingModule } from './member-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { UserMenuComponent } from './user-menu/user-menu.component';

@NgModule({
    declarations: [...memberRoutingComponents, UserMenuComponent],
    imports: [
        CommonModule,
        MemberRoutingModule,
        ReactiveFormsModule,
        LazyLoadImageModule,
    ],
    exports: [
        UserMenuComponent,
    ]
})
export class MemberModule { }
