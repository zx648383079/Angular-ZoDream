import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualComponent } from './visual.component';
import { VisualRoutingModule } from './visual-routing.module';
import { VisualEditorModule } from './visual-editor/visual-editor.module';

@NgModule({
    imports: [
        CommonModule,
        VisualRoutingModule,
        VisualEditorModule
    ],
    declarations: [
        VisualComponent
    ],
})
export class VisualModule { }
