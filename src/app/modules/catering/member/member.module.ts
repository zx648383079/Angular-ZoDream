import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { memberRoutingComponents, MemberRoutingModule } from './member-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        MemberRoutingModule,
    ],
    declarations: [...memberRoutingComponents],
})
export class MemberModule { }
