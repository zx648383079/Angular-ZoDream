import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiFieldTrComponent } from './api-field-tr/api-field-tr.component';
import { TreePanelComponent } from './tree-panel/tree-panel.component';
import { ContextMenuModule } from '../../../components/context-menu';
import { ReactiveFormsModule } from '@angular/forms';
import { DesktopModule } from '../../../components/desktop';
import { ThemeModule } from '../../../theme/theme.module';

const COMPONENTS = [
    ApiFieldTrComponent,
    TreePanelComponent
];

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ReactiveFormsModule,
        ContextMenuModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS]
})
export class DocumentSharedModule { }
