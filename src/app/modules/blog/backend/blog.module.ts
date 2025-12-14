import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogBackendRoutingModule, blogBackendRoutedComponents } from './blog-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { BlogService } from './blog.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZreEditorModule } from '../../../components/editor';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';
import { ZreSwiperModule } from '../../../components/swiper';
import { Field } from '@angular/forms/signals';


@NgModule({
    declarations: [...blogBackendRoutedComponents],
    imports: [
        CommonModule,
        ThemeModule,
        Field,
        DesktopModule,
        BlogBackendRoutingModule,
        NgSelectModule,
        ZreEditorModule,
        ZreSwiperModule,
        ZreFormModule,
    ],
    providers: [
        BlogService,
    ]
})
export class BlogBackendModule { }
