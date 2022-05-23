import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { NoteBackendComponent } from './note-backend.component';

const routes: Routes = [
    { path: 'list', component: ListComponent },
    { path: '', component: NoteBackendComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NoteRoutingModule { }

export const noteRoutingComponents = [
    NoteBackendComponent, ListComponent
];
