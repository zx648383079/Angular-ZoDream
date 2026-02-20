import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogBackendRoutingModule, blogBackendRoutedComponents } from './blog-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { BlogService } from './blog.service';
import { ZreEditorModule } from '../../../components/editor';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';
import { ZreSwiperModule } from '../../../components/swiper';
import { FormField } from '@angular/forms/signals';


@NgModule({
    declarations: [...blogBackendRoutedComponents],
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DesktopModule,
        BlogBackendRoutingModule,
        ZreEditorModule,
        ZreSwiperModule,
        ZreFormModule,
    ],
    providers: [
        BlogService,
    ]
})
export class BlogBackendModule { }
