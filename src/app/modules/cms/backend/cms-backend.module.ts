import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { cmsBackendRoutedComponents, CMSBackendRoutingModule } from './backend-routing.module';
import { CmsService } from './cms.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ZreEditorModule, ZreHtmlEditorModule } from '../../../components/editor';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        CMSBackendRoutingModule,
        ZreHtmlEditorModule,
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
