import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { cmsBackendRoutedComponents, CMSBackendRoutingModule } from './backend-routing.module';
import { CmsService } from './cms.service';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        EditorModule,
        CMSBackendRoutingModule,
    ],
    declarations: [...cmsBackendRoutedComponents],
    providers: [
        CmsService,
    ]
})
export class CmsBackendModule { }
