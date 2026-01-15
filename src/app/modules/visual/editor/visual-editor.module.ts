import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../theme/theme.module';
import { ContextMenuModule } from '../../../components/context-menu';
import { DialogModule } from '../../../components/dialog';
import { EditorService } from './editor.service';
import { ZreFormModule } from '../../../components/form';
import { ProgressModule } from '../../../components/progress';
import { VisualEditorRoutingModule, visualEditorRoutingComponents } from './routing.module';
import { FormField } from '@angular/forms/signals';

@NgModule({
    imports: [
        CommonModule,
        ThemeModule,
        FormField,
        ContextMenuModule,
        VisualEditorRoutingModule,
        DialogModule,
        ZreFormModule,
        ProgressModule,
    ],
    declarations: [	
       ...visualEditorRoutingComponents
   ],
    providers: [
        EditorService,
    ],
})
export class VisualEditorModule { }
