import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentMemberComponent } from './document-member.component';

const routes: Routes = [
    {
        path: '',
        component: DocumentMemberComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentMemberRoutingModule { }

export const documentMemberRoutingComponents = [
    DocumentMemberComponent
];
