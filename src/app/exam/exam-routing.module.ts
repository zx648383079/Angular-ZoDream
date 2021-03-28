import {
    NgModule
} from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { CourseComponent } from './course/course.component';
import { ExamComponent } from './exam.component';
import { PagerComponent } from './pager/pager.component';
import { QuestionInputComponent } from './question/question-input/question-input.component';
import { QuestionComponent } from './question/question.component';


const routes: Routes = [
    {
        path: 'question/:id',
        component: QuestionComponent,
    },
    {
        path: 'course/:course',
        component: QuestionComponent,
    },
    {
        path: 'pager/:course/:type',
        component: PagerComponent,
    },
    {
        path: 'pager/:id',
        component: PagerComponent,
    },
    {
        path: ':id',
        component: CourseComponent,
    },
    {
        path: '',
        component: ExamComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamRoutingModule {}

export const examRoutedComponents = [
    ExamComponent, CourseComponent, QuestionComponent, QuestionInputComponent, PagerComponent
];