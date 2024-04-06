import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberSpaceRoutingModule, memberSpaceRoutedComponents } from './routing.module';
import { MemberSpaceService } from './member-space.service';
import { ThemeModule } from '../../../theme/theme.module';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        MemberSpaceRoutingModule
    ],
    declarations: [...memberSpaceRoutedComponents],
    providers: [
        MemberSpaceService,
    ]
})
export class MemberSpaceModule { }
