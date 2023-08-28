import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { BlogService } from './blog.service';
import { ThemeModule } from '../../theme/theme.module';
import { MediaPlayerModule } from '../../components/media-player';
import { ZreEditorModule } from '../../components/editor';


@NgModule({
    declarations: [BlogComponent],
    imports: [
        CommonModule,
        ThemeModule,
        BlogRoutingModule,
        MediaPlayerModule,
        ZreEditorModule,
    ],
    providers: [
        BlogService
    ],
})
export class BlogModule { }
