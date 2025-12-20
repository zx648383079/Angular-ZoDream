import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumMemberRoutingComponents, ForumMemberRoutingModule } from './routing.module';
import { ForumService } from './forum.service';
import { ThemeModule } from '../../../theme/theme.module';
import { DesktopModule } from '../../../components/desktop';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DesktopModule,
        ForumMemberRoutingModule
    ],
    declarations: [...ForumMemberRoutingComponents],
    providers: [
        ForumService
    ]
})
export class ForumMemberModule { }
