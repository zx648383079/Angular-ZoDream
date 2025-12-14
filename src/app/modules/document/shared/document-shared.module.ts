import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiFieldTrComponent } from './api-field-tr/api-field-tr.component';
import { TreePanelComponent } from './tree-panel/tree-panel.component';
import { ContextMenuModule } from '../../../components/context-menu';
import { DesktopModule } from '../../../components/desktop';
import { ThemeModule } from '../../../theme/theme.module';
import { ZreFormModule } from '../../../components/form';

const COMPONENTS = [
    ApiFieldTrComponent,
    TreePanelComponent
];

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        DesktopModule,
        ZreFormModule,
        ContextMenuModule,
    ],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS]
})
export class DocumentSharedModule { }
