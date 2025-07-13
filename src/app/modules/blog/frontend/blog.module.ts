import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule, blogRoutingComponents } from './blog-routing.module';
import { BlogService } from './blog.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../../theme/theme.module';
import { MediaPlayerModule } from '../../../components/media-player';
import { ZreFormModule } from '../../../components/form';
import { LinkRuleModule } from '../../../components/link-rule';
import { ZreEditorModule } from '../../../components/editor';
import { DesktopModule } from '../../../components/desktop';
import { TabletModule } from '../../../components/tablet';


@NgModule({
    declarations: [...blogRoutingComponents],
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        FormsModule,
        DesktopModule,
        TabletModule,
        BlogRoutingModule,
        MediaPlayerModule,
        ZreFormModule,
        ZreEditorModule,
        LinkRuleModule,
    ],
    providers: [
        BlogService
    ]
})
export class BlogModule { }
