import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { BookEditorComponent } from './book-editor.component';
import { EditorMapPanelComponent } from './map-panel/editor-map-panel.component';
import { EditorPreferencesPanelComponent } from './preferences-panel/editor-preferences-panel.component';
import { EditorRolePanelComponent } from './role-panel/editor-role-panel.component';

const routes: Routes = [
    {
        path: '',
        component: BookEditorComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BookEditorRoutingModule {}


export const bookEditorRoutingComponents = [
    BookEditorComponent,
    EditorRolePanelComponent,
    EditorPreferencesPanelComponent,
    EditorMapPanelComponent,
];
