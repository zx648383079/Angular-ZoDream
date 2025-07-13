import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumMemberRoutingComponents, ForumMemberRoutingModule } from './routing.module';
import { ForumService } from './forum.service';
import { ThemeModule } from '../../../theme/theme.module';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ForumMemberRoutingModule
    ],
    declarations: [...ForumMemberRoutingComponents],
    providers: [
        ForumService
    ]
})
export class ForumMemberModule { }
