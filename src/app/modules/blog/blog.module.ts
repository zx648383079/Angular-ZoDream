import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { BlogService } from './blog.service';
import { ThemeModule } from '../../theme/theme.module';
import { MediaPlayerModule } from '../../components/media-player';
import { ZreEditorModule } from '../../components/editor';
import { DesktopModule } from '../../components/desktop';
import { TabletModule } from '../../components/tablet';
import { Field } from '@angular/forms/signals';


@NgModule({
    declarations: [BlogComponent],
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DesktopModule,
        TabletModule,
        BlogRoutingModule,
        MediaPlayerModule,
        ZreEditorModule,
    ],
    providers: [
        BlogService
    ],
})
export class BlogModule { }
