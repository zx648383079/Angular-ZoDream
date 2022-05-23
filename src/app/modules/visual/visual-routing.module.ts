import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VisualComponent } from './visual.component';

const routes: Routes = [
    { path: ':id', component: VisualComponent },
    { path: '', component: VisualComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VisualRoutingModule { }
