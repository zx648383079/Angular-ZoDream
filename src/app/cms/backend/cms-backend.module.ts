import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme/theme.module';
import { cmsBackendRoutedComponents, CMSBackendRoutingModule } from './backend-routing.module';
import { CmsService } from './cms.service';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ZreEditorModule } from '../../editor/editor.module';
import { DialogModule } from '../../dialog';
import { ZreFormModule } from '../../form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        EditorModule,
        CMSBackendRoutingModule,
        ZreEditorModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...cmsBackendRoutedComponents],
    providers: [
        CmsService,
    ]
})
export class CmsBackendModule { }
