import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { BlogMemberRoutingModule, blogMemberRoutingComponents } from './blog-routing.module';
import { BlogService } from './blog.service';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        DialogModule,
        DesktopModule,
        BlogMemberRoutingModule,
        ZreFormModule,
        ZreEditorModule,
    ],
    declarations: [...blogMemberRoutingComponents],
    providers: [
        BlogService
    ]
})
export class BlogMemberModule { }
