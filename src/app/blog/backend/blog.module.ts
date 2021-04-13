import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BlogBackendRoutingModule, blogBackendRoutedComponents } from './blog-routing.module';
import { ThemeModule } from '../../theme/theme.module';
import { BlogService } from './blog.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZoEditorModule } from '../../editor/editor.module';


@NgModule({
    declarations: [...blogBackendRoutedComponents],
    imports: [
        CommonModule,
        ThemeModule,
        BlogBackendRoutingModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        NgSelectModule,
        EditorModule,
        ZoEditorModule,
    ],
    providers: [
        BlogService,
    ]
})
export class BlogBackendModule { }
