import {
    NgModule
} from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { CourseComponent } from './course/course.component';
import { ExamBackendComponent } from './exam-backend.component';
import { EditPageComponent } from './page/edit/edit-page.component';
import { EvaluateComponent } from './page/evaluate/evaluate.component';
import { PageComponent } from './page/page.component';
import { EditQuestionComponent } from './question/edit/edit-question.component';
import { QuestionComponent } from './question/question.component';

const routes: Routes = [
    {
        path: 'course',
        component: CourseComponent,
    },
    {
        path: 'question/create',
        component: EditQuestionComponent,
    },
    {
        path: 'question/edit/:id',
        component: EditQuestionComponent,
    },
    {
        path: 'question',
        component: QuestionComponent,
    },
    {
        path: 'page/create',
        component: EditPageComponent,
    },
    {
        path: 'page/edit/:id',
        component: EditPageComponent,
    },
    {
        path: 'page/evaluate/:id',
        component: EvaluateComponent,
    },
    {
        path: 'page',
        component: PageComponent,
    },
    {
        path: '',
        component: ExamBackendComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamBackendRoutingModule {}

export const examBackendRoutedComponents = [
    ExamBackendComponent, QuestionComponent, CourseComponent, PageComponent, EditQuestionComponent, EditPageComponent, EvaluateComponent
];