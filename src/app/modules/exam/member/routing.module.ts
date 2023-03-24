import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExamMemberComponent } from './exam-member.component';

const routes: Routes = [
    {
        path: '',
        component: ExamMemberComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamMemberRoutingModule { }

export const ExamMemberRoutingComponents = [
    ExamMemberComponent
];
