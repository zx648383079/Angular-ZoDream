import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentMemberRoutingModule, documentMemberRoutingComponents } from './routing.module';
import { DocumentService } from './document.service';
import { DialogModule } from '../../../components/dialog';
import { ZreEditorModule } from '../../../components/editor';
import { ZreFormModule } from '../../../components/form';
import { ThemeModule } from '../../../theme/theme.module';
import { DocumentSharedModule } from '../shared';
import { DesktopModule } from '../../../components/desktop';
import { TabletModule } from '../../../components/tablet';
import { Field } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        Field,
        DocumentMemberRoutingModule,
        ThemeModule,
        DesktopModule,
        TabletModule,
        ZreEditorModule,
        DocumentSharedModule,
        DialogModule,
        ZreFormModule,
    ],
    declarations: [...documentMemberRoutingComponents],
    providers: [
        DocumentService
    ]
})
export class DocumentMemberModule { }
