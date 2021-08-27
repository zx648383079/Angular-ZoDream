import {
    NgModule
} from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { CourseComponent } from './course/course.component';
import { ExamComponent } from './exam.component';
import { PageEditorComponent } from './page-editor/page-editor.component';
import { PagerComponent } from './pager/pager.component';
import { QuestionComponent } from './question/question.component';
import { SearchComponent } from './search/search.component';


const routes: Routes = [
    {
        path: 'question/:id',
        component: QuestionComponent,
    },
    {
        path: 'publish/:course/:id',
        component: PageEditorComponent,
    },
    {
        path: 'publish/:course',
        component: PageEditorComponent,
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
        path: 'search',
        component: SearchComponent,
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
    ExamComponent, CourseComponent, QuestionComponent, PagerComponent,  PageEditorComponent, SearchComponent, 
];