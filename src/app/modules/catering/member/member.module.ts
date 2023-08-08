import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { memberRoutingComponents, MemberRoutingModule } from './member-routing.module';
import { ThemeModule } from '../../../theme/theme.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        MemberRoutingModule,
    ],
    declarations: [...memberRoutingComponents],
})
export class MemberModule { }
