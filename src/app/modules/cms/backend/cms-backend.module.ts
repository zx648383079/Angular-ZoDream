import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { cmsBackendRoutedComponents, CMSBackendRoutingModule } from './backend-routing.module';
import { CmsService } from './cms.service';
import { ZreEditorModule } from '../../../components/editor';
import { DialogModule } from '../../../components/dialog';
import { ZreFormModule } from '../../../components/form';
import { DesktopModule } from '../../../components/desktop';
import { FormField } from '@angular/forms/signals';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        ReactiveFormsModule,
        FormField,
        DesktopModule,
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
