import {
    NgModule
} from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { CourseComponent } from './course/course.component';
import { ExamComponent } from './exam.component';
import { QuestionComponent } from './question/question.component';


const routes: Routes = [
    {
        path: 'question/:course',
        component: QuestionComponent,
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
    ExamComponent, CourseComponent, QuestionComponent
];