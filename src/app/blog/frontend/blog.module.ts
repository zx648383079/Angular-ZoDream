import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule, blogRoutingComponents } from './blog-routing.module';
import { BlogService } from './blog.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../theme/theme.module';
import { MediaPlayerModule } from '../../media-player/media-player.module';


@NgModule({
    declarations: [...blogRoutingComponents],
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        FormsModule,
        BlogRoutingModule,
        MediaPlayerModule,
    ],
    providers: [
        BlogService
    ]
})
export class BlogModule { }
