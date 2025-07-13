import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { DialogModule } from '../../../components/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { ZreFormModule } from '../../../components/form';
import { ZreEditorModule } from '../../../components/editor';
import { BlogMemberRoutingModule, blogMemberRoutingComponents } from './blog-routing.module';
import { BlogService } from './blog.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { DesktopModule } from '../../../components/desktop';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DialogModule,
        DesktopModule,
        ReactiveFormsModule,
        BlogMemberRoutingModule,
        ZreFormModule,
        NgSelectModule,
        ZreEditorModule,
    ],
    declarations: [...blogMemberRoutingComponents],
    providers: [
        BlogService
    ]
})
export class BlogMemberModule { }
