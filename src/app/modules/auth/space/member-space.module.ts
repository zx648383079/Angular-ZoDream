import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberSpaceRoutingModule, memberSpaceRoutedComponents } from './routing.module';
import { MemberSpaceService } from './member-space.service';
import { ThemeModule } from '../../../theme/theme.module';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        MemberSpaceRoutingModule
    ],
    declarations: [...memberSpaceRoutedComponents],
    providers: [
        MemberSpaceService,
    ]
})
export class MemberSpaceModule { }
