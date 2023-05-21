import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogBackendRoutingModule, blogBackendRoutedComponents } from './blog-routing.module';
import { ThemeModule } from '../../../theme/theme.module';
import { BlogService } from './blog.service';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZreEditorModule } from '../../../components/editor';
import { ZreFormModule } from '../../../components/form';


@NgModule({
    declarations: [...blogBackendRoutedComponents],
    imports: [
        CommonModule,
        ThemeModule,
        BlogBackendRoutingModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        NgSelectModule,
        ZreEditorModule,
        ZreFormModule,
    ],
    providers: [
        BlogService,
    ]
})
export class BlogBackendModule { }
